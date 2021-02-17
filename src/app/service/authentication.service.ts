import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap, take, tap } from 'rxjs/operators';
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
    // Set the initial value of the subject to the user-session from local storage, or and
    // empty user-session if not found (logged-out)
    this.currentSessionSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('currentSession') || '{}')
    );
  }

  public getCurrentSession(): Observable<UserSession> {
    return this.currentSessionSubject.asObservable();
  }

  public getLoggedIn(): Observable<boolean> {
    return this.getCurrentSession().pipe(
      take(1),
      map((session) => Object.keys(session).length > 0)
    );
  }

  public logout() {
    localStorage.removeItem('currentSession');
    this.currentSessionSubject.next({} as UserSession);
  }

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

  //Joins together user token and user info into single user session object
  //Populates the loggedInSubject with true and currentSessionSubject with the user session
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
              let currentSession : UserSession = { ...user, ...session };
              this.setUserSession(currentSession);
              return currentSession;
            })
          )
        )
      );
  }

  private refreshTimer(){
    let tk =jwtDecode(this.currentSessionSubject.value.access) as JWT;
    let timeout = tk.exp*1000 - Date.now() - (60*1000);
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );

  }

  public refreshToken(): Observable<User>{
    if(!localStorage.getItem('currentSession')){
      console.log('Not Logged In')
      return EMPTY;
    }
    return this.http
      .post<Token>(`${APIUrl}/token/refresh/`, {
        refresh: this.currentSessionSubject.value.refresh})
      .pipe(
        map((accessToken) => {
          const currentSession = {
            ...this.currentSessionSubject.value,
            ...accessToken,
          } as UserSession;
          this.setUserSession(currentSession);
          console.log('Token Refreshed');
          this.refreshTimer();
          return currentSession;
        })
      );
  }

}
