import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TaskData } from 'src/app/models/dialog-data/task-data';
import { Section } from 'src/app/models/section';
import { Task } from 'src/app/models/task';
import { UserSession } from 'src/app/models/user-session';
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
  @Output() taskMove : EventEmitter<any> = new EventEmitter();

  taskList$!: Observable<Task[]>;
  userSession!: UserSession;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.taskList$ = this.taskService.getTasks(this.section.id);
    this.authService
      .getCurrentSession()
      .subscribe((session) => (this.userSession = session));
  }

  addTaskDialog(id: number) {
    let taskDialog = this.dialog.open(TaskInputBoxComponent, {
      width: '250px',
      data: { heading: '', description: '' },
    });

    taskDialog.afterClosed().subscribe((task: TaskData) => {
      if (task) {
        task.user = this.userSession.id;
        this.taskList$ = this.taskService.addTask(task, id);
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    let newSectionID = event.container.id;
    let taskID = event.previousContainer.data[event.previousIndex].id + '';
    let currentID = event.currentIndex;
    let previousId = event.previousIndex;
    let followID;
    //If move happening within section the followID depends on the direction the task is moved (up or down)
    //If no task to follow set to 0
    if (newSectionID === event.previousContainer.id) {
      if (previousId < currentID) {
        followID = event.container.data[event.currentIndex]
          ? event.container.data[event.currentIndex].id + ''
          : '0';
      } else {
        followID = event.container.data[event.currentIndex - 1]
          ? event.container.data[event.currentIndex - 1].id + ''
          : '0';
      }
    } else {
      followID = event.container.data[event.currentIndex - 1]
        ? event.container.data[event.currentIndex - 1].id + ''
        : '0';
    }
    let task = event.previousContainer.data[event.previousIndex];
    this.taskService.moveTask(newSectionID,taskID,followID,task).subscribe(()=>(this.taskMove.emit()))
  }
}
