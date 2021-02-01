import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  currentUser!: string;
  loggedIn!: boolean;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService
      .getLoggedIn()
      .subscribe((status) => (this.loggedIn = status));
  }

  isLoggedIn(): boolean {
    if (this.loggedIn && localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(
        localStorage.getItem('currentUser')!
      ).username;
      return true;
    }

    return false;
  }
}
