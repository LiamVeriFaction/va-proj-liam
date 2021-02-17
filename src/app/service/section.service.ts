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

  /**
   * Get a single section using its id
   * @param id the sectionID of the section you want
   */
  getSection(id: number): Observable<Section> {
    return this.http.get<Section>(`${APIUrl}/section/${id}/`);
  }

  /**
   * Get all the tasks assigned to a section
   * @param id the sectionID who's tasks you want
   */
  getTasks(id: number): Observable<Task[]> {
    let p = new HttpParams().set('ordering', 'task_order');
    return this.http.get<Task[]>(`${APIUrl}/section/${id}/task/`, {
      params: p,
    });
  }

  /**
   * Add a new task to a section
   * @param task the TaskData of the new Task
   * @param id the section the task is assigned to
   */
  addTask(task: TaskData, id: number): Observable<Task[]> {
    return this.http.post<Task>(`${APIUrl}/section/${id}/task/`, task).pipe(
      switchMap(() => {
        return this.getTasks(id);
      })
    );
  }

  /**
   * Moves a task between two sections or within a single section
   * In order to perform a move
   *  -Determine the followID of the moved task, this depends on where the move is being made
   *  -Make a tempUpdate to allow an animated move to be done locally
   *  -Send the move to the api
   *  -Refresh the affected sections
   * @param event the event data of the move event
   */
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

  /**
   * Edit a section
   * @param id The ID of the section
   * @param section The new SectionData
   */
  editSection(id: number, section: SectionData) {
    return this.http.patch(`${APIUrl}/section/${id}/`, section);
  }

  /**
   * Delete a section
   * @param id The ID of the section you want to delete
   */
  deleteSection(id: number) {
    return this.http.delete(`${APIUrl}/section/${id}/`);
  }

  /**
   * Move a section's order within a project
   * @param section The section you want to move
   * @param followID The followID of that section
   */
  moveSection(section: Section, followID: number) {
    return this.http.patch(
      `${APIUrl}/section/${section.id}/insert_after/${followID}/`,
      section
    );
  }
}
