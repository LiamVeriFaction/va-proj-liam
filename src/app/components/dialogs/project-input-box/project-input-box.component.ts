import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectData } from 'src/app/models/dialog-data/project.data';

@Component({
  selector: 'app-project-input-box',
  templateUrl: './project-input-box.component.html',
  styleUrls: ['./project-input-box.component.css']
})
export class ProjectInputBoxComponent {

  constructor(
    public dialogRef: MatDialogRef<ProjectInputBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
