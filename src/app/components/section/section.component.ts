import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Section } from 'src/app/models/section';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { SectionService } from 'src/app/service/section.service';
import { TaskService } from 'src/app/service/task.service';
import { TaskInputBoxComponent } from '../dialogs/task-input-box/task-input-box.component';

@Component({
  selector: 'section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent implements OnInit {
  @Input() id!: number;

  section$!: Observable<Section>;
  taskList$!: Observable<Task[]>;

  constructor(
    private sectionService: SectionService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.section$ = this.sectionService.getSection(this.id);
    this.taskList$ = this.taskService.getTasks(this.id);
  }

  openDialog(id : number) {
    let taskDialog = this.dialog.open(TaskInputBoxComponent, {
      width: '250px',
      data: { heading: '', description: '' },
    });

    taskDialog.afterClosed().subscribe((task) => {
      if (task) {
      this.taskService.addTask(task,id).subscribe((task) => console.log(task))
      }
    });
  }
}
