import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() id!: number;
  task$!: Observable<Task>;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.task$ = this.taskService.getTask(this.id);
  }
}
