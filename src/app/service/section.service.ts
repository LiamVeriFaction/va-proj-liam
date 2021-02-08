import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { SectionData } from '../models/dialog-data/section-data';
import { TaskData } from '../models/dialog-data/task-data';
import { Section } from '../models/section';
import { Task } from '../models/task';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  getSection(id: number): Observable<Section> {
    return this.http.get<Section>(`${APIUrl}/section/${id}/`);
  }

  getTasks(id: number): Observable<Task[]> {
    let p = new HttpParams().set('ordering', 'task_order');
    return this.http.get<Task[]>(`${APIUrl}/section/${id}/task/`, {
      params: p,
    });
  }

  addTask(task: TaskData, id: number): Observable<Task[]> {
    return this.http.post<Task>(`${APIUrl}/section/${id}/task/`, task).pipe(
      switchMap(() => {
        return this.getTasks(id);
      })
    );
  }

  moveTask(event: CdkDragDrop<Task[]>) {
    let prevSectionID = +event.previousContainer.id;
    let sectionID = event.container.id;
    let currentID = event.currentIndex;
    let previousId = event.previousIndex;
    let task = event.previousContainer.data[event.previousIndex];
    let followID;
    //If move happening within section the followID depends on the direction the task is moved (up or down)
    //If no task to follow set to 0
    if (sectionID === event.previousContainer.id) {
      if (previousId < currentID) {
        followID = event.container.data[event.currentIndex]
          ? event.container.data[event.currentIndex].id + ''
          : '0';
      } else {
        followID = event.container.data[event.currentIndex - 1]
          ? event.container.data[event.currentIndex - 1].id + ''
          : '0';
      }
    } else {
      followID = event.container.data[event.currentIndex - 1]
        ? event.container.data[event.currentIndex - 1].id + ''
        : '0';
    }

    //While app waits for App response, make the changes locally so there is no delay.
    //Temp Data is overwritten by refresh API calls.
    let tempNewData = event.container.data;
    let tempOldData = event.previousContainer.data;

    //If moving to another section
    if (prevSectionID !== +sectionID) {
      tempOldData.splice(previousId, 1);
      tempNewData.splice(currentID, 0, task);
      this.alertService.tasksUpdate(currentID, 'tempUpdate', tempNewData);
      this.alertService.tasksUpdate(prevSectionID, 'tempUpdate', tempOldData);
    } else {
      //If moving within section
      tempNewData.splice(previousId, 1);
      tempNewData.splice(currentID, 0, task);
      this.alertService.tasksUpdate(prevSectionID, 'tempUpdate', tempNewData);
    }

    return this.http
      .patch<Task>(
        `${APIUrl}/section/${sectionID}/task/${task.id}/insert_after/${followID}/`,
        task
      )
      .pipe(
        tap(() => {
          //This updates will overwrite the previous local changes, ensuring alignment with API
          this.alertService.tasksUpdate(prevSectionID, 'update', {} as Task[]);
          if (prevSectionID !== +sectionID) {
            this.alertService.tasksUpdate(+sectionID, 'update', {} as Task[]);
          }
        })
      );
  }

  editSection(id:number, section:SectionData){
    return this.http.patch(`${APIUrl}/section/${id}/`,section);
  }

  deleteSection(id:number){
    return this.http.delete(`${APIUrl}/section/${id}/`);
  }

}
