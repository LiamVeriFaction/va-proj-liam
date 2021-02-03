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
   * @param id The section ID
   */
  getTasks(id: number): Observable<Task[]> {
    let p = new HttpParams().set('ordering', 'task_order');
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
    return this.http.post<Task>(`${APIUrl}/section/${id}/task/`, task).pipe(
      switchMap(() => {
        return this.getTasks(id);
      })
    );
  }

  updateTask(task: Task) : Observable<Task>{
    return  this.http.patch<Task>(`${APIUrl}/task/${task.id}/`,task)
  }

  updateOrder(taskList : Task[]) : Observable<Task[]>{

     return of(taskList.map((task:Task, index:number) =>{
      task.task_order = (index+1)*1000;
      this.updateTask(task).subscribe();
      return task;
    }))
    

  }
}
