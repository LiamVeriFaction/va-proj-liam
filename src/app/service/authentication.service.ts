import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { timer, Observable, EMPTY, BehaviorSubject } from 'rxjs';

import { APIUrl } from '../models/api';
import { Token } from '../models/token';
import { UserService } from './user.service';
import { User } from '../models/user';
import { UserSession } from '../models/user-session';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private refreshInterval = timer(0, 4 * 60 * 1000); //Refreshing once and then every 4 minutes
  public currentSessionSubject: BehaviorSubject<UserSession>;

  constructor(private http: HttpClient, private userService: UserService) {
    this.currentSessionSubject = new BehaviorSubject<UserSession>(
      {} as UserSession
    );
    //Check if already signed in
    let currentSession = localStorage.getItem('currentSession');

    if (currentSession) {
      console.log('Existing token found');
      this.currentSessionSubject.next(JSON.parse(currentSession));
    }

    const refreshSub = this.refreshInterval.subscribe((n) => {
      this.refresh().subscribe(); //Calls refresh every 4 minutes
    });
  }

  public getCurrentSession(): Observable<UserSession> {
    return this.currentSessionSubject.asObservable();
  }

  public logout() {
    this.currentSessionSubject.next({} as UserSession);
  }

  //Joins together user token and user info into single user session object
  //Populates the loggedInSubject with true and currentSessionSubject with the user session
  login(username: string, password: string) {
    return this.http
      .post<Token>(`${APIUrl}/token/`, { username, password })
      .pipe(
        switchMap((token: Token) => {
          console.log('Token Received');
          let header = new HttpHeaders({
            Authorization: `Bearer ${token.access}`,
          }); //Manually intercept since userSessionSubject is still blank
          return this.http
            .get<User>(`${APIUrl}/currentuser/`, { headers: header })
            .pipe(
              map((user: User) => {
                console.log('User Info Received');
                let currentSession: UserSession = { ...user, ...token };
                this.currentSessionSubject.next(currentSession);
                localStorage.setItem(
                  'currentSession',
                  JSON.stringify(currentSession)
                );
                return this.currentSessionSubject.value;
              })
            );
        })
      );
  }

  //Every four minutes, this is called to refresh access
  //Called at bootstrap, not run unless there is existing access token
  refresh() {
    let currentSession = this.currentSessionSubject.value;
    if (currentSession.access) {
      console.log('Refreshing token');
      return this.http
        .post<any>(`${APIUrl}/token/refresh/`, {
          refresh: currentSession.refresh,
        })
        .pipe(
          tap((newAccess: Token) => {
            currentSession.access = newAccess.access;
            this.currentSessionSubject.next(currentSession);
            localStorage.setItem(
              'currentSession',
              JSON.stringify(currentSession)
            );
          })
        );
    }
    return EMPTY;
  }
}
