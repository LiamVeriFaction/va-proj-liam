import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  user!: User;
  form!: FormGroup;
  username!: FormControl;
  first_name!: FormControl;
  last_name!: FormControl;
  email!: FormControl;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser')!);

    this.username = new FormControl(this.user.first_name, Validators.required);
    this.first_name = new FormControl(
      this.user.first_name,
      Validators.required
    );
    this.last_name = new FormControl(this.user.first_name, Validators.required);
    this.email! = new FormControl(this.user.first_name, Validators.required);

    this.form = new FormGroup({
      username: this.username,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
    });
  }
}
