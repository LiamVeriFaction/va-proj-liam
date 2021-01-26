import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject!: ReplaySubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new ReplaySubject<User>(1);

    var curr = localStorage.getItem('currentUser');
    if (curr) {
      this.currentUserSubject.next(JSON.parse(curr));
    }
  }

  public getCurrentUser() : Observable<User>{

    return this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {
    
    return this.http
      .post<any>(`${API}/token/`, { username, password })
      .pipe(
        map((user) => {
          user.loggedIn = new Date().getTime();
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }


  getAll() {
    return this.http.get<User[]>(`${API}/project/`).pipe(map((data: any) => { return data.data; }));
  }
}

const USERNAME = 'liam';
const PASSWORD = '9ZmvnqK1G4rgPrTCJX';
const API = 'https://vaproj.itstudio.ie/api';
