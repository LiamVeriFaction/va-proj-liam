import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})

//Alert Service Subject is subscribed to by Sections.
//The alert passes alerts to sections
export class AlertService {
  //Subject contains section ID, updateType and the new Task Data
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
