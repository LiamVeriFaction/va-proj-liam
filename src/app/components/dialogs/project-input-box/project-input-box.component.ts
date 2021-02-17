import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectData } from 'src/app/models/dialog-data/project.data';

@Component({
  selector: 'app-project-input-box',
  templateUrl: './project-input-box.component.html',
  styleUrls: ['./project-input-box.component.css'],
})
export class ProjectInputBoxComponent {
  form: FormGroup;
  project_name: FormControl;
  description: FormControl;
  start_date: FormControl;
  target_date: FormControl;

  constructor(
    public dialogRef: MatDialogRef<ProjectInputBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectData
  ) {
    this.project_name = new FormControl(data.project_name, Validators.required);
    this.description = new FormControl(data.description, Validators.required);
    this.start_date = new FormControl(data.start_date, Validators.required);
    this.target_date = new FormControl(data.target_date, Validators.required);

    this.form = new FormGroup({
      project_name: this.project_name,
      description: this.description,
      start_date: this.start_date,
      target_date: this.target_date,
    });
  }

  onNoClick(): void {
    this.form.reset();
    this.dialogRef.close(this.form.value);
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }
}
