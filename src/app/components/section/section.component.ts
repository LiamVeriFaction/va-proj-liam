import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TaskData } from 'src/app/models/dialog-data/task-data';
import { Section } from 'src/app/models/section';
import { Task } from 'src/app/models/task';
import { UserSession } from 'src/app/models/user-session';
import { AlertService } from 'src/app/service/alert.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { SectionService } from 'src/app/service/section.service';
import { TaskService } from 'src/app/service/task.service';
import { TaskInputBoxComponent } from '../dialogs/task-input-box/task-input-box.component';

@Component({
  selector: 'section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent implements OnInit {
  @Input() section!: Section;
  @Input() connectedLists!: string[];

  userSession!: UserSession;
  taskList!: Task[];

  constructor(
    private sectionService: SectionService,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private alertService : AlertService,
  ) {}

  ngOnInit(): void {
    this.refreshTasks();
    this.authService
      .getCurrentSession()
      .subscribe((session: UserSession) => (this.userSession = session));

    this.alertService.getTaskUpdateAlert().subscribe((update) => {
      if (update[0] === this.section.id) {
        if(update[1] === 'update' ){
        this.refreshTasks();
        }else if(update[1]==='tempUpdate'){
          this.taskList = update[2];
        }
      }
    });
  }

  addTaskDialog(id: number) {
    let taskDialog = this.dialog.open(TaskInputBoxComponent, {
      width: '250px',
      data: { heading: '', description: '' },
    });

    taskDialog.afterClosed().subscribe((task: TaskData) => {
      if (task) {
        task.user = this.userSession.id;
        this.sectionService
          .addTask(task, id)
          .subscribe(() => this.refreshTasks());
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    this.sectionService
      .moveTask(event)
      .subscribe();

  }

  refreshTasks() {
    this.sectionService
      .getTasks(this.section.id)
      .subscribe((taskList: Task[]) => (this.taskList = taskList));
  }
}
