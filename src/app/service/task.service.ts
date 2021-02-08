import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { NoteData } from '../models/dialog-data/note-data';
import { Note } from '../models/note';
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

  getNotes(id: number): Observable<Note[]>{
    return this.http.get<Note[]>(`${APIUrl}/task/${id}/note/`);
  }

  addNote(note: NoteData, id: number): Observable<Note[]> {
    return this.http
      .post<Note>(`${APIUrl}/task/${id}/note/`, note)
      .pipe(
        switchMap(() => {
          return this.getNotes(id);
        })
      );
  }

  
}
