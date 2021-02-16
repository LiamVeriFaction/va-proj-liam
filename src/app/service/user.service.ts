import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/currentuser/`);
  }

  editUser(user: User): Observable<User> {
    return this.http.patch<User>(
      `${environment.apiUrl}/user/${user.id}/`,
      user
    );
  }
}
