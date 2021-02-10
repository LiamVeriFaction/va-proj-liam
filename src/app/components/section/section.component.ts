import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskData } from 'src/app/models/dialog-data/task-data';
import { Section } from 'src/app/models/section';
import { Task } from 'src/app/models/task';
import { UserSession } from 'src/app/models/user-session';
import { AlertService } from 'src/app/service/alert.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { SectionService } from 'src/app/service/section.service';
import { TaskService } from 'src/app/service/task.service';
import { ConfirmBoxComponent } from '../dialogs/confirm-box/confirm-box.component';
import { TaskInputBoxComponent } from '../dialogs/task-input-box/task-input-box.component';

@Component({
  selector: 'section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent implements OnInit {
  @Input() section!: Section;
  @Input() connectedLists!: string[];
  @Output() changeSection : EventEmitter<[string,Section]> = new EventEmitter();

  userSession!: UserSession;
  taskList!: Task[];
  //Between local change and api result, don't allow additional drags
  dragAllowed = true; 

  constructor(
    private sectionService: SectionService,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.refreshTasks();
    this.authService
      .getCurrentSession()
      .subscribe((session: UserSession) => (this.userSession = session));

    //Based on alert service either update local sectionlist or fetch new one from API
    //Update comes in the form [section.id, code:string, taskList[]]
    this.alertService.getTaskUpdateAlert().subscribe((update) => {
      if (update[0] === this.section.id) {
        if (update[1] === 'update') {
          this.refreshTasks();
        } else if (update[1] === 'tempUpdate') {
          this.taskList = update[2];
        }
      }
    });
  }

  //Opens a task dialog that makes a new task if a task is returned (task.heading exists)
  addTaskDialog(id: number) {
    let taskDialog = this.dialog.open(TaskInputBoxComponent, {
      width: '250px',
      data: { heading: '', description: '' },
    });

    taskDialog.afterClosed().subscribe((task: TaskData) => {
      if (task.heading) {
        task.user = this.userSession.id;
        this.sectionService
          .addTask(task, id)
          .subscribe((tasks : Task[]) => (this.taskList = tasks));
      }
    });
  }

  //Called when task is dropped
  drop(event: CdkDragDrop<Task[]>) {
    this.dragAllowed = false;
    this.sectionService.moveTask(event).subscribe();
  }

  //Fetch tasklist from API
  refreshTasks() {
    this.sectionService
      .getTasks(this.section.id)
      .subscribe((taskList: Task[]) => {
        this.taskList = taskList
        this.dragAllowed = true;});
  }

  //Project-Page will open Edit Dialog to change details of section
  editSection(){
    this.changeSection.emit(["edit",this.section]);
  }

  //Dialog Box to Confirm Delete, if true emit delete to the Project-Page
  deleteSection(){
    let confirmDialog = this.dialog.open(ConfirmBoxComponent, {
      width: '250px',
      data: {heading: 'Delete Section', message : 'Are you sure you want to delete this section?'}
    })

    confirmDialog.afterClosed().subscribe(result => {
      if(result){
        this.changeSection.emit(["delete",this.section]);
      }
    })
    
  }

  changeTask(event: [string, Task]) {

    //On edit, reopen the dialog for input but put current value in data
    if (event[0] === 'edit') {

      let taskDialog = this.dialog.open(TaskInputBoxComponent, {
        width: '250px',
        data: { heading: event[1].heading, description: event[1].description },
      });
  
      taskDialog.afterClosed().subscribe((task: TaskData) => {

        if (task.heading) {
          task.user = this.userSession.id;
          this.taskService.editTask(event[1].id,task).subscribe(() => this.refreshTasks());
        }
      });

    //On Delete, call delete from taskService, then refresh tasks
    } else if (event[0] === 'delete') {
      this.taskService
        .deleteTask(event[1].id)
        .subscribe(() => this.refreshTasks());
    }
  }


}
