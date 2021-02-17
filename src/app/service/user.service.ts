import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIUrl } from '../models/api';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * get the current usser
   */
  getUser(): Observable<User> {
    return this.http.get<User>(`${APIUrl}/currentuser/`);
  }

  /**
   * Edit the details of the current user
   * @param user the new UserData
   */
  editUser(user: User): Observable<User> {
    return this.http.patch<User>(`${APIUrl}/user/${user.id}/`, user);
  }
}
