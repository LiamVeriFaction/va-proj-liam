import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoteData } from 'src/app/models/dialog-data/note-data';
import { Note } from 'src/app/models/note';
import { Task } from 'src/app/models/task';
import { UserSession } from 'src/app/models/user-session';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NoteService } from 'src/app/service/note.service';
import { TaskService } from 'src/app/service/task.service';
import { NoteInputBoxComponent } from '../dialogs/note-input-box/note-input-box.component';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() task!: Task;
  panelOpenState = false;
  noteList!: Note[];
  userSession!: UserSession;
  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.authService
      .getCurrentSession()
      .subscribe((session: UserSession) => (this.userSession = session));

    this.taskService
      .getNotes(this.task.id)
      .subscribe((notes) => (this.noteList = notes));
  }

  addNoteDialog(id: number) {
    let taskDialog = this.dialog.open(NoteInputBoxComponent, {
      width: '250px',
      data: { content: '' },
    });

    taskDialog.afterClosed().subscribe((note: NoteData) => {
      if (note.content) {
        note.user = this.userSession.id;
        this.taskService.addNote(note, id).subscribe(() => this.refreshNotes());
      }
    });
  }

  refreshNotes() {
    this.taskService
      .getNotes(this.task.id)
      .subscribe((notes) => (this.noteList = notes));
  }

  changeNote(event: [string, Note]) {
    if (event[0] === 'edit') {

      let taskDialog = this.dialog.open(NoteInputBoxComponent, {
        width: '250px',
        data: { content: event[1].content },
      });
  
      taskDialog.afterClosed().subscribe((note: NoteData) => {
        if (note.content) {
          note.user = this.userSession.id;
          this.noteService.editNote(event[1].id,note).subscribe(() => this.refreshNotes());
        }
      });


    } else if (event[0] === 'delete') {
      this.noteService
        .deleteNote(event[1].id)
        .subscribe(() => this.refreshNotes());
    }
  }
}
