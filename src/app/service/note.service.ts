import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIUrl } from '../models/api';
import { NoteData } from '../models/dialog-data/note-data';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  constructor(private http: HttpClient) {}

  /**
   * Deletes a note
   * @param id ID of the note to be deleted
   */
  deleteNote(id: number) {
    return this.http.delete(`${APIUrl}/note/${id}/`);
  }

  /**
   * Edits a note
   * @param id ID of the note to be editted
   * @param note New Note Data
   */
  editNote(id: number, note: NoteData) {
    return this.http.patch(`${APIUrl}/note/${id}/`, note);
  }
}
