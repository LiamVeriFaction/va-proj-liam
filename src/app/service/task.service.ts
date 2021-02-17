import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { NoteData } from '../models/dialog-data/note-data';
import { TaskData } from '../models/dialog-data/task-data';
import { Note } from '../models/note';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  /**
   * Get a single task
   * @param id The task ID
   */
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${APIUrl}/task/${id}/`);
  }

  /**
   * Get all the notes assigned to a task
   * @param id The task who's notes you want
   */
  getNotes(id: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${APIUrl}/task/${id}/note/`);
  }

  /**
   * Create a new note on a task
   * @param note The NoteData of the new task
   * @param id The id of the task
   */
  addNote(note: NoteData, id: number): Observable<Note[]> {
    return this.http.post<Note>(`${APIUrl}/task/${id}/note/`, note).pipe(
      switchMap(() => {
        return this.getNotes(id);
      })
    );
  }

  /**
   * Edit a selected task
   * @param id the id of the task you want to edit
   * @param task the new data for that task
   */
  editTask(id: number, task: TaskData) {
    return this.http.patch(`${APIUrl}/task/${id}/`, task);
  }

  /**
   * Delete a task
   * @param id the task you want to delete
   */
  deleteTask(id: number) {
    return this.http.delete(`${APIUrl}/task/${id}/`);
  }
}
