import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  updateTasksAlertSubject: BehaviorSubject<[number, string, Task[]]>;

  constructor() {
    this.updateTasksAlertSubject = new BehaviorSubject<
      [number, string, Task[]]
    >([-1, '', {} as Task[]]);
  }

  getTaskUpdateAlert(): Observable<[number, string, Task[]]> {
    return this.updateTasksAlertSubject.asObservable();
  }

  tasksUpdate(id: number, type: string, taskList: Task[]) {
    this.updateTasksAlertSubject.next([id, type, taskList]);
  }
}
