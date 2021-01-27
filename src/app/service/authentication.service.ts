import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { interval, Observable, ReplaySubject, EMPTY } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject!: ReplaySubject<User>; 
  private refreshInterval = interval(4 * 60 * 1000); //Refresh every 4 minutes

  constructor(private http: HttpClient) {
    this.currentUserSubject = new ReplaySubject<User>(1);
    let currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      console.log('Existing token found: ', JSON.parse(currentUser));
      this.currentUserSubject.next(JSON.parse(currentUser));

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
      .post<any>(`${API}/token/`, { username, password })
      .pipe(
        map((user) => {
          localStorage.setItem('loginTime', new Date().getTime().toString());
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
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
        .post<any>(`${API}/token/refresh/`, { refresh })
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

  getAll() {
    return this.http.get<User[]>(`${API}/project/`).pipe(
      map((data: any) => {
        console.log(data);
        return data.data;
      })
    );
  }
}

export const API = 'https://vaproj.itstudio.ie/api';
