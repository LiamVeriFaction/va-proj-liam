import { Injectable } from '@angular/core';
import { MatSnackBar, _SnackBarContainer } from '@angular/material/snack-bar';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  loggedIn!: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    authService.getLoggedIn().subscribe((status) => (this.loggedIn = status));
  }

  canActivate() {
    if (this.loggedIn) {
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
