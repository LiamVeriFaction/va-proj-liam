import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoteData } from 'src/app/models/dialog-data/note-data';

@Component({
  selector: 'app-note-input-box',
  templateUrl: './note-input-box.component.html',
  styleUrls: ['./note-input-box.component.css'],
})
export class NoteInputBoxComponent implements OnInit {
  form: FormGroup;
  content: FormControl;

  constructor(
    public dialogRef: MatDialogRef<NoteInputBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NoteData
  ) {

    this.content = new FormControl(data.content, Validators.required);
    this.form = new FormGroup({
      content : this.content,
    })
  }

  onNoClick(): void {
    this.form.reset()
    this.dialogRef.close(this.form.value);
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }

  ngOnInit(): void {}
}
