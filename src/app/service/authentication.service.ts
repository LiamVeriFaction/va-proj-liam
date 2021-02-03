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
  private refreshInterval = timer(0, 4 * 60 * 1000); //Refreshing once and then every 4 minutes
  public loggedIn: BehaviorSubject<boolean>;
  public currentTokenSubject: BehaviorSubject<Token>

  constructor(private http: HttpClient, private userService: UserService) {
    this.loggedIn = new BehaviorSubject<boolean>(false);
    this.currentTokenSubject = new BehaviorSubject<Token>({} as Token);
    let currentToken = localStorage.getItem('currentToken');

    if (currentToken) {
      console.log('Existing token found: ', JSON.parse(currentToken));
      this.loggedIn.next(true);
      this.currentTokenSubject.next(JSON.parse(currentToken));
    }

    const refreshSub = this.refreshInterval.subscribe((n) => {
      this.refresh().subscribe(); //Calls refresh every 4 minutes
    });
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
          localStorage.setItem('currentToken', JSON.stringify(token));
          return this.userService.newLogin();
        })
      );
  }

  refresh(): Observable<any> {
    let currentToken = this.currentTokenSubject.value
    if (currentToken) {
      console.log('Refreshing token');
      let refresh = currentToken.refresh;
      return this.http
        .post<any>(`${APIUrl}/token/refresh/`, { refresh })
        .pipe(
          tap((newAccess: Token) => {
            let currentToken = this.currentTokenSubject.value;
            currentToken.access = newAccess.access;
            this.currentTokenSubject.next(currentToken);
            localStorage.setItem('currentToken', JSON.stringify(currentToken));
          })
        );
    }
    return EMPTY;
  }
}
