import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskData } from 'src/app/models/dialog-data/task-data';

@Component({
  selector: 'task-input-box',
  templateUrl: './task-input-box.component.html',
  styleUrls: ['./task-input-box.component.css'],
})
export class TaskInputBoxComponent {
  form: FormGroup;
  heading: FormControl;
  description: FormControl;

  constructor(
    public dialogRef: MatDialogRef<TaskInputBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskData
  ) {
    this.heading = new FormControl(data.heading, Validators.required);
    this.description = new FormControl(data.description, Validators.required);

    this.form = new FormGroup({
      heading: this.heading,
      description: this.description,
    });
  }

  onNoClick(): void {
    this.form.reset()
    this.dialogRef.close(this.form.value);
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }
}
