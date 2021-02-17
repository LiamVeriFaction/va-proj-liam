import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoteData } from 'src/app/models/dialog-data/note-data';
import { Note } from 'src/app/models/note';
import { Task } from 'src/app/models/task';
import { UserSession } from 'src/app/models/user-session';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NoteService } from 'src/app/service/note.service';
import { TaskService } from 'src/app/service/task.service';
import { ConfirmBoxComponent } from '../dialogs/confirm-box/confirm-box.component';
import { NoteInputBoxComponent } from '../dialogs/note-input-box/note-input-box.component';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() task!: Task;
  noteList!: Note[];
  userSession!: UserSession;
  panelOpenState = false;
  @Output() changeTask: EventEmitter<[string, Task]> = new EventEmitter();
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

    this.refreshNotes();
  }

  /**
   * Opens a note dialog that makes a new note if a note is returned (note.heading exists)
   * @param id the task id, needed to add notes
   */
  addNoteDialog(id: number) {
    let taskDialog = this.dialog.open(NoteInputBoxComponent, {
      width: '250px',
      data: { content: '' },
    });

    taskDialog.afterClosed().subscribe((note: NoteData) => {
      if (note.content) {
        note.user = this.userSession.id;
        this.taskService
          .addNote(note, id)
          .subscribe((notes: Note[]) => (this.noteList = notes));
      }
    });
  }

  /**
   * Refresh the notes from the API
   */
  refreshNotes() {
    this.taskService
      .getNotes(this.task.id)
      .subscribe((notes) => (this.noteList = notes));
  }

  /**
   * Opens an edit dialog or a confirm delete dialog based on the icon pressed
   * @param event event has a type (edit/delete) and the note that is affected
   */
  changeNote(event: [string, Note]) {
    //On edit, reopen the dialog for input but put current value in data
    if (event[0] === 'edit') {
      let noteDialog = this.dialog.open(NoteInputBoxComponent, {
        width: '250px',
        data: { content: event[1].content },
      });

      noteDialog.afterClosed().subscribe((note: NoteData) => {
        if (note.content) {
          note.user = this.userSession.id;
          this.noteService
            .editNote(event[1].id, note)
            .subscribe(() => this.refreshNotes());
        }
      });

      //On Delete, call delete from noteService, then refresh tasks
    } else if (event[0] === 'delete') {
      this.noteService
        .deleteNote(event[1].id)
        .subscribe(() => this.refreshNotes());
    }
  }

  /**
   * Section-Component will open Edit Dialog to change details of section
   */
  editTask() {
    this.changeTask.emit(['edit', this.task]);
  }

  /**
   * Dialog Box to Confirm Delete, if true emit delete to the Section-Component
   */
  deleteTask() {
    let confirmDialog = this.dialog.open(ConfirmBoxComponent, {
      width: '250px',
      data: {
        heading: 'Delete Task',
        message: 'Are you sure you want to delete this task?',
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.changeTask.emit(['delete', this.task]);
      }
    });
  }
}
