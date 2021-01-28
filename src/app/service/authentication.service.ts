import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { interval, Observable, ReplaySubject, EMPTY } from 'rxjs';

import { APIUrl } from '../models/api';
import { Token } from '../models/token';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentTokenSubject!: ReplaySubject<Token>;
  private refreshInterval = interval(4 * 60 * 1000); //Refresh every 4 minutes

  public loggedIn: boolean;

  constructor(private http: HttpClient) {
    this.loggedIn = false;

    this.currentTokenSubject = new ReplaySubject<Token>(1);
    let currentToken = localStorage.getItem('currentToken');

    if (currentToken) {
      console.log('Existing token found: ', JSON.parse(currentToken));
      this.currentTokenSubject.next(JSON.parse(currentToken));
      this.loggedIn = true;
    }

    const refreshSub = this.refreshInterval.subscribe((n) => {
      this.refresh().subscribe(); //Calls refresh every 4 minutes
    });
  }

  public getCurrentToken(): Observable<Token> {
    return this.currentTokenSubject.asObservable();
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${APIUrl}/token/`, { username, password })
      .pipe(
        map((token) => {
          localStorage.setItem('loginTime', new Date().getTime().toString());
          localStorage.setItem('currentToken', JSON.stringify(token));
          localStorage.setItem('username', username);
          this.currentTokenSubject.next(token);
          this.refresh().subscribe();
          this.loggedIn = true;
          return token;
         
        })
      );
  }

  refresh(): Observable<any> {
    let currentToken = localStorage.getItem('currentToken');
    if (currentToken) {
      console.log('Refreshing token');
      let refresh = JSON.parse(currentToken).refresh;
      return this.http
        .post<any>(`${APIUrl}/token/refresh/`, { refresh })
        .pipe(
          map((newToken) => {
            let token = JSON.parse(localStorage.getItem('currentToken')!);
            token.access = newToken.access;
            localStorage.setItem('loginTime', new Date().getTime().toString());
            localStorage.setItem('currentToken', JSON.stringify(token));
            this.currentTokenSubject.next(token);
            return newToken;
          })
        );
    }
    return EMPTY;
  }
}
