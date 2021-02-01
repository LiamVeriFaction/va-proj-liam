import { Component, Inject, OnInit } from '@angular/core';
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

  constructor(
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProjectInputBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectData
  ) {
    this.form = formBuilder.group({
      project_name: [data.project_name, [Validators.required]],
      description: [data.description, [Validators.required]],
      start_date: [data.start_date, [Validators.required]],
      target_date: [data.target_date, [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void{
    const {value, valid} = this.form;
    if(valid){
      this.dialogRef.close(value);
    }
  }
}
