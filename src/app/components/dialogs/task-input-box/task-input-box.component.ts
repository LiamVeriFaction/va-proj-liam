import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskData } from 'src/app/models/dialog-data/task-data';

@Component({
  selector: 'task-input-box',
  templateUrl: './task-input-box.component.html',
  styleUrls: ['./task-input-box.component.css'],
})
export class TaskInputBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<TaskInputBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
