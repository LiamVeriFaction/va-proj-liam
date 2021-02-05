import { Injectable } from '@angular/core';
import { MatSnackBar, _SnackBarContainer } from '@angular/material/snack-bar';
import { CanActivate, Router } from '@angular/router';
import { UserSession } from '../models/user-session';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  userSession!: UserSession;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    authService
      .getCurrentSession()
      .subscribe((session) => (this.userSession = session));
  }

  //Stops users getting to pages manually if they not logged in
  canActivate() {
    if (this.userSession.access) {
      return true;
    } else {
      this.snackBar.open('Please login first', '', {
        duration: 2000,
      });
      this.router.navigate(['/login']);
      return false;
    }
  }
}
