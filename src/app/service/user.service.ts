import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  storeCurrentUser(): Observable<User> {
    return this.http.get<User>(`${APIUrl}/currentuser/`).pipe(
      tap((user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userID', user.id + '');
      })
    );
  }
}
