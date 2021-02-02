import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SectionData } from 'src/app/models/dialog-data/section-data';

@Component({
  selector: 'app-section-input-box',
  templateUrl: './section-input-box.component.html',
  styleUrls: ['./section-input-box.component.css'],
})
export class SectionInputBoxComponent {
  form: FormGroup;
  heading: FormControl;
  description: FormControl;

  constructor(
    public dialogRef: MatDialogRef<SectionInputBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SectionData
  ) {
    this.heading = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);

    this.form = new FormGroup({
      heading: this.heading,
      description: this.description,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
