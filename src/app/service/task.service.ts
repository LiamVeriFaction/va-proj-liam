import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIUrl } from '../models/api';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(id : number) : Observable<Task[]>{
    return this.http.get<Task[]>(`${APIUrl}/section/${id}/task/`)
  }

  getTask(id: number) : Observable<Task>{
    return this.http.get<Task>(`${APIUrl}/task/${id}/`)
  }
}
