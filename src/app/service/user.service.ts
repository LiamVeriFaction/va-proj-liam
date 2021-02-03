import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private currentUserSubject : BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>({} as User);

  }

  newLogin() : Observable<User>{
    return this.http.get<User>(`${APIUrl}/currentuser/`).pipe(
      tap((user: User) => {
        this.currentUserSubject.next(user);
      })
    );
  }

}
