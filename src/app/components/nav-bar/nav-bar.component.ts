import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  currentUser$!: Observable<User>;
  loggedIn!: boolean;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService
      .getLoggedIn()
      .subscribe((status) => (this.loggedIn = status));

      this.currentUser$ = this.userService.newLogin();
  }

  isLoggedIn(): boolean {
    if (this.loggedIn) {
      return true;
    }

    return false;
  }
}
