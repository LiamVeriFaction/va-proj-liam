import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIUrl } from '../models/api';
import { NoteData } from '../models/dialog-data/note-data';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  deleteNote(id : number){
    return this.http.delete(`${APIUrl}/note/${id}/`);
  }

  editNote(id : number, note : NoteData){
    return this.http.patch(`${APIUrl}/note/${id}/`,note);
  }




}
