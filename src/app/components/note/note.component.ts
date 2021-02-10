import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Note } from 'src/app/models/note';
import { ConfirmBoxComponent } from '../dialogs/confirm-box/confirm-box.component';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit {
  @Input() note!: Note;
  @Output() changeNote: EventEmitter<[string, Note]> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  //Task-Component will open Edit Dialog to change details of note
  editNote() {
    this.changeNote.emit(['edit', this.note]);
  }

  //Dialog Box to Confirm Delete, if true emit delete to the Task-Component
  deleteNote() {
    let confirmDialog = this.dialog.open(ConfirmBoxComponent, {
      width: '250px',
      data: {
        heading: 'Delete Note',
        message: 'Are you sure you want to delete this Note?',
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.changeNote.emit(['delete', this.note]);
      }
    });
  }
}
