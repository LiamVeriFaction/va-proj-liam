import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { APIUrl } from '../models/api';
import { Token } from '../models/token';
import { User } from '../models/user';
import { UserSession } from '../models/user-session';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly storageKey: string = 'currentSession';

  private currentSessionSubject: BehaviorSubject<UserSession>;

  constructor(private http: HttpClient, private userService: UserService) {
    // Set the initial value of the subject to the user-session from local storage, or and
    // empty user-session if not found (logged-out).  This inital value will be emitted immediately
    // to all observers of `currentSession$`.
    // ** A behaviour subject will always emit its inital/last value for new subscribers
    this.currentSessionSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem(this.storageKey) || '{}')
    );
  }

  /**
   * Observable to return the current user-session
   *
   * - If the user is logged out, an empty user-session will be returned
   */
  public get currentSession$(): Observable<UserSession> {
    return this.currentSessionSubject.asObservable();
  }

  /**
   * Observable to determine if we have a logged in user-session
   */
  public get loggedInSession$(): Observable<boolean> {
    return this.currentSession$.pipe(
      take(1),
      map((session) => Object.keys(session).length > 0)
    );
  }

  /**
   * Logout the user from the system by removing the user-session from local storage and notifying
   * subscribers of `currentSession$` of the change.
   */
  public logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentSessionSubject.next({} as UserSession);
  }

  /**
   * Set the specified user-session in local storage and notify subscribers of `currentSession$`
   * of the new user-session information.
   *
   * @param session the update user-session context
   */
  private setUserSession(session: UserSession): void {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.currentSessionSubject.next(session);
  }

  public updateUserInfo(): Observable<User> {
    return this.userService
      .getUser()
      .pipe(
        tap((user) =>
          this.setUserSession({ ...this.currentSessionSubject.value, ...user })
        )
      );
  }

  /**
   * Login the user on the server-api, with the specified username and password
   *
   * If the login is successful:
   *
   * - Set the initial user-session with the token information (access and refresh tokens)
   * - This the initial logged-in state allows us to retrieve the current logged-in user from the server-api
   *   with the Bearer access token populated for this request.
   * - Extend the current user-session context with the new user information
   *
   * @param username the username value
   * @param password the password value
   */
  public login(username: string, password: string): Observable<UserSession> {
    return this.http
      .post<Token>(`${APIUrl}/token/`, { username, password })
      .pipe(
        map((token) => {
          const initialSession = { ...token } as UserSession;
          this.setUserSession(initialSession);
          return initialSession;
        }),
        switchMap((session) =>
          this.userService.getUser().pipe(
            map((user: User) => {
              const currentSession = { ...user, ...session } as UserSession;
              this.setUserSession(currentSession);
              return currentSession;
            })
          )
        )
      );
  }
}
