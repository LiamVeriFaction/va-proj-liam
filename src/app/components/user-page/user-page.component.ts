import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  ngOnInit(): void {}
}
