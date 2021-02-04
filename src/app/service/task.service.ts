import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { TaskData } from '../models/dialog-data/task-data';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}
  
  /**
   *
   * @param id The task ID
   */
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${APIUrl}/task/${id}/`);
  }




}
