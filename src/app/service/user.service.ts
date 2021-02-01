import { HttpClient } from '@angular/common/http';
import { flatten } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map, mergeAll, find } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  storeCurrentUser(): Observable<User> {
    return this.http.get<User>(`${APIUrl}/currentuser/`).pipe(
      map((user: User) => {
        localStorage.setItem('userID',user.id+"");
        localStorage.setItem('username',user.username);
        return user;
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${APIUrl}/currentuser/`);
  }
}
