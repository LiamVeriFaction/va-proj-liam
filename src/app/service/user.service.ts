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


  getUser() : Observable<User>{
    return this.http.get<User>(`${APIUrl}/currentuser/`);
  }

  editUser(user :User) : Observable<User>{
    return this.http.patch<User>(`${APIUrl}/user/${user.id}/`,user);
  }



}
