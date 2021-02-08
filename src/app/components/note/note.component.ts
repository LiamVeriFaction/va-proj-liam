import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Note } from 'src/app/models/note';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input() note! : Note;
  @Output() changeNote : EventEmitter<[string,Note]> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  editNote(){
    this.changeNote.emit(["edit",this.note]);
  }

  deleteNote(){
    this.changeNote.emit(["delete",this.note]);
  }

}
