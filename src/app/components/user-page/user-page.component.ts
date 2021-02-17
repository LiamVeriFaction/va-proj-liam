import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  user!: User;
  disabled = true; //Controls if edit or save/cancel buttons showing

  form = new FormGroup({
    username: new FormControl(),
    first_name: new FormControl(),
    last_name: new FormControl(),
    email: new FormControl(),
  });

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar : MatSnackBar,
    private authService : AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      
      this.user = user;

      this.form = this.formBuilder.group({
        username: [this.user.username,Validators.required],
        first_name:  [this.user.first_name],
        last_name:  [this.user.last_name],
        email:  [this.user.email],
      });

      this.form.disable();
    });
  }

  cancelEdit(){
    //Reset form back to original values
    this.form = this.formBuilder.group({
      username: [this.user.username,Validators.required],
      first_name:  [this.user.first_name],
      last_name:  [this.user.last_name],
      email:  [this.user.email],
    });

    this.form.disable();
    this.disabled=true;
  

  }

  editDetails(){
    this.form.enable();
    this.disabled=false;
  }

  submit(){
    this.user.username = this.form.get('username')?.value;
    this.user.first_name = this.form.get('first_name')?.value;
    this.user.last_name = this.form.get('last_name')?.value;
    this.user.email= this.form.get('email')?.value;
    this.userService.editUser(this.user).subscribe((user) => {
      
      this.snackBar.open('Changes Succesful');
      this.user = user
      this.form.disable();
      this.disabled=true;

      this.authService.updateUserInfo().subscribe();

    });

  }
}
