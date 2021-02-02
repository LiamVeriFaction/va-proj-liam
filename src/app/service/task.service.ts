import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
   * @param id The section ID
   */
  getTasks(id: number): Observable<Task[]> {
    let p = new HttpParams().set('ordering', 'heading');
    return this.http.get<Task[]>(`${APIUrl}/section/${id}/task/`, {
      params: p,
    });
  }

  /**
   *
   * @param id The task ID
   */
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${APIUrl}/task/${id}/`);
  }

  /**
   *
   * @param id The section ID
   */
  addTask(task: TaskData, id: number): Observable<Task[]> {
    task.user = +localStorage.getItem('userID')!;
    return this.http.post<Task>(`${APIUrl}/section/${id}/task/`, task).pipe(
      switchMap(() => {
        return this.getTasks(id);
      })
    );
  }
}
