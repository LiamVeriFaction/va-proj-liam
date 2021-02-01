import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { timer, Observable, ReplaySubject, EMPTY, BehaviorSubject } from 'rxjs';

import { APIUrl } from '../models/api';
import { Token } from '../models/token';
import { UserService } from './user.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentTokenSubject!: ReplaySubject<Token>;
  private refreshInterval = timer(0, 4 * 60 * 1000); //Refreshing once and then every 4 minutes
  private loggedIn: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private userService: UserService) {
    this.loggedIn = new BehaviorSubject<boolean>(false);

    this.currentTokenSubject = new ReplaySubject<Token>(1);

    let currentToken = localStorage.getItem('currentToken');
    if (currentToken) {
      console.log('Existing token found: ', JSON.parse(currentToken));
      this.currentTokenSubject.next(JSON.parse(currentToken));
      this.loggedIn.next(true);
    }

    const refreshSub = this.refreshInterval.subscribe((n) => {
      this.refresh().subscribe(); //Calls refresh every 4 minutes
    });
  }

  public getCurrentToken(): Observable<Token> {
    return this.currentTokenSubject.asObservable();
  }

  public getLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  public changeLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<Token>(`${APIUrl}/token/`, { username, password })
      .pipe(
        switchMap((token: Token) => {
          this.loggedIn.next(true);
          this.currentTokenSubject.next(token);
          localStorage.setItem('currentToken', JSON.stringify(token));
          return this.userService.storeCurrentUser();
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
          tap((newToken: Token) => {
            let token = JSON.parse(localStorage.getItem('currentToken')!);
            token.access = newToken.access;
            localStorage.setItem('currentToken', JSON.stringify(token));
            this.currentTokenSubject.next(token);
          })
        );
    }
    return EMPTY;
  }
}
