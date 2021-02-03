import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserSession } from 'src/app/models/user-session';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  currentUserSession!: UserSession;
  loggedIn!: boolean;

  constructor(
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
      this.authService.getCurrentSession().subscribe((session) => (this.currentUserSession = session));
  }

  isLoggedIn(): boolean {
    if (this.currentUserSession) {
      return true;
    }

    return false;
  }
}
