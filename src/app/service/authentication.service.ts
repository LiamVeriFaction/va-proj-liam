import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { Token } from '../models/token';
import { User } from '../models/user';
import { UserSession } from '../models/user-session';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly storageKey: string = 'currentSession';

  private currentSessionSubject: BehaviorSubject<UserSession>;
  private refreshTokenTimeout!: ReturnType<typeof setTimeout>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {
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
    clearTimeout(this.refreshTokenTimeout);
    localStorage.removeItem(this.storageKey);
    this.currentSessionSubject.next({} as UserSession);
    this.router.navigate(['/login']);
  }

  /**
   * Update the current user-session from the server-api after an update
   */
  public updateUserInfo(): Observable<User> {
    return this.userService
      .getUser()
      .pipe(
        tap((user) => this.setUserSession({ ...this.currentSession, ...user }))
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
      .post<Token>(`${environment.apiUrl}/token/`, { username, password })
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
              this.startRefreshtimer();
              return currentSession;
            })
          )
        )
      );
  }

  /**
   * Refresh the current JWT access token, before it expires, and retrieve and store the
   * refreshed JWT access token.
   */
  public refreshToken(): Observable<User> {
    return this.http
      .post<Token>(`${environment.apiUrl}/token/refresh/`, {
        refresh: this.currentSession?.refresh || 'refresh-token',
      })
      .pipe(
        map((accessToken) => {
          const currentSession = {
            ...this.currentSession,
            ...accessToken,
          } as UserSession;
          this.setUserSession(currentSession);
          console.log('this.startRefreshtimer()');
          this.startRefreshtimer();
          return currentSession;
        })
      );
  }

  /**
   * Retrieve the current user-session stored in the subject
   */
  private get currentSession(): UserSession {
    return this.currentSessionSubject.value;
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

  /**
   * Start the refresh token timer
   *
   * - Parse the payload from the encoded JWT access token
   * - Determine the time into the future that the JWT access token expires
   * - Set a timeout to refresh the access token to one minute before it expires
   */
  private startRefreshtimer(): void {
    // JWT Access Token Format:
    // <base64(header).base64(payload).base64(signature)
    const accessToken = this.currentSession.access;
    // Decode (using base64) the JWT payload, this will contain the token expiry time into the
    // future, set by the server-api, which will be used as the base for refreshing the token
    // before it expires.
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    // Calculate the future expiry time, probably now + 5 minutes
    const expires = new Date(payload.exp * 1000);
    // Set the refresh timeout to the expiry time - 1 minute, in milliseconds.  At this point,
    // we will send the access + refresh token to the refresh server-api endpoint, to retrieve
    // a new access token.
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }
}
