import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { interval, Observable, ReplaySubject, EMPTY } from 'rxjs';

import { User } from '../models/user';
import { Project } from '../models/project';
import { APIUrl } from '../models/api';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject!: ReplaySubject<User>;
  private refreshInterval = interval(4 * 60 * 1000); //Refresh every 4 minutes

  public loggedIn: boolean;

  constructor(private http: HttpClient) {
    this.loggedIn = false;

    this.currentUserSubject = new ReplaySubject<User>(1);
    let currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      console.log('Existing token found: ', JSON.parse(currentUser));
      this.currentUserSubject.next(JSON.parse(currentUser));
      this.loggedIn = true;
    }

    const refreshSub = this.refreshInterval.subscribe((n) => {
      this.refresh().subscribe(); //Calls refresh every 4 minutes
    });
  }

  public getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${APIUrl}/token/`, { username, password })
      .pipe(
        map((user) => {
          localStorage.setItem('loginTime', new Date().getTime().toString());
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.loggedIn = true;
          return user;
        })
      );
  }

  refresh(): Observable<any> {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      console.log('Refreshing token');
      let refresh = JSON.parse(currentUser).refresh;
      return this.http
        .post<any>(`${APIUrl}/token/refresh/`, { refresh })
        .pipe(
          map((token) => {
            let user = JSON.parse(localStorage.getItem('currentUser')!);
            user.access = token.access;
            localStorage.setItem('loginTime', new Date().getTime().toString());
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
          })
        );
    }
    return EMPTY;
  }
}
