import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})

/**
 * Alert Service Subject is subscribed to by Sections.
 * The alert passes alerts to sections
 */
export class AlertService {
  //Subject contains section ID, updateType and the new Task Data
  updateTasksAlertSubject: BehaviorSubject<[number, string, Task[]]>;

  constructor() {
    this.updateTasksAlertSubject = new BehaviorSubject<
      [number, string, Task[]]
    >([-1, '', {} as Task[]]);
  }

  /**
   * Returns the subject to the subscribing sections
   */
  getTaskUpdateAlert(): Observable<[number, string, Task[]]> {
    return this.updateTasksAlertSubject.asObservable();
  }

  /**
   * The sectionservice sends updates to the sections through the alert service
   * This way sections can be updated by moves from other sections\
   *
   * @param id the section affected
   * @param type the type of update (tempUpdate/update)
   * @param taskList the tasklist to be used in tempUpdates
   */
  tasksUpdate(id: number, type: string, taskList: Task[]) {
    this.updateTasksAlertSubject.next([id, type, taskList]);
  }
}
