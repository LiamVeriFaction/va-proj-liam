import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SectionData } from 'src/app/models/dialog-data/section-data';

@Component({
  selector: 'app-section-input-box',
  templateUrl: './section-input-box.component.html',
  styleUrls: ['./section-input-box.component.css']
})
export class SectionInputBoxComponent  {
  
  constructor(
    public dialogRef: MatDialogRef<SectionInputBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SectionData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
