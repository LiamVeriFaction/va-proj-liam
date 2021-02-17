import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { timer, Observable, EMPTY, BehaviorSubject, interval } from 'rxjs';

import { APIUrl } from '../models/api';
import { Token } from '../models/token';
import { UserService } from './user.service';
import { User } from '../models/user';
import { UserSession } from '../models/user-session';
import jwtDecode from 'jwt-decode';
import { JWT } from '../models/jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public currentSessionSubject: BehaviorSubject<UserSession>;
  private refreshTokenTimeout!: ReturnType<typeof setTimeout>;

  constructor(private http: HttpClient, private userService: UserService) {
    // Set the initial value of the subject to the user-session from local storage, or
    // empty user-session if not found (logged-out)
    this.currentSessionSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('currentSession') || '{}')
    );
  }

  public getCurrentSession(): Observable<UserSession> {
    return this.currentSessionSubject.asObservable();
  }

  /**
   * Observable to determine if we have a logged in user-session
   */
  public getLoggedIn(): Observable<boolean> {
    return this.getCurrentSession().pipe(
      take(1),
      map((session) => Object.keys(session).length > 0)
    );
  }

  /**
   * Logout the user from the system by removing the user-session from local storage and notifying
   * subscribers of `currentSession$` of the change.
   */
  public logout() {
    clearTimeout(this.refreshTokenTimeout);
    localStorage.removeItem('currentSession');
    this.currentSessionSubject.next({} as UserSession);
  }

  /**
   * Update the current user-session from the server-api after an update
   */
  public updateUserInfo() {
    return this.http.get<User>(`${APIUrl}/currentuser/`).pipe(
      tap((user: User) => {
        let currentSession = this.currentSessionSubject.value;
        currentSession.username = user.username;
        currentSession.first_name = user.first_name;
        currentSession.last_name = user.last_name;
        currentSession.email = user.email;
        this.setUserSession(currentSession);
      })
    );
  }

  public setUserSession(userSession: UserSession) {
    this.currentSessionSubject.next(userSession);
    localStorage.setItem('currentSession', JSON.stringify(userSession));
  }

  /**
   * If the login is successful:
   *  -Set the initial user-session with the token information
   *  -Start the RefreshTimer based on the expiry time of the token
   *  -Get the user details from the api using our new token
   *  -Combine the token and user details into a new userSession
   *
   *
   * @param username the username value
   * @param password the password value
   */
  login(username: string, password: string): Observable<UserSession> {
    return this.http
      .post<Token>(`${APIUrl}/token/`, { username, password })
      .pipe(
        map((token: Token) => {
          console.log('Token Received');
          let initialSession = { ...token } as UserSession;
          this.setUserSession(initialSession);
          this.refreshTimer();
          return initialSession;
        }),
        switchMap((session) =>
          this.userService.getUser().pipe(
            map((user: User) => {
              console.log('User Received');
              let currentSession: UserSession = { ...user, ...session };
              this.setUserSession(currentSession);
              return currentSession;
            })
          )
        )
      );
  }

  /**
   * Decode the current token and call a refresh a minute before it expires
   */
  private refreshTimer() {
    let tk = jwtDecode(this.currentSessionSubject.value.access) as JWT;
    let timeout = tk.exp * 1000 - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  /**
   * Refresh the current JWT access token, before it expires, and retrieve and store the
   * refreshed JWT access token.
   */
  public refreshToken(): Observable<User> {
    return this.getLoggedIn().pipe(
      filter(Boolean),
      switchMap((t) => {
        console.log(t);
        return this.http
          .post<Token>(`${APIUrl}/token/refresh/`, {
            refresh:
              this.currentSessionSubject.value.refresh || 'refresh-token',
          })
          .pipe(
            map((accessToken) => {
              const currentSession = {
                ...this.currentSessionSubject.value,
                ...accessToken,
              } as UserSession;
              this.setUserSession(currentSession);
              console.log('Refreshing Token');
              this.refreshTimer();
              return currentSession;
            })
          );
      })
    );
  }
}
