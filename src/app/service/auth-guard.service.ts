import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  loggedIn!: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    authService.getLoggedIn().subscribe((status) => (this.loggedIn = status));
  }

  canActivate() {
    if (this.loggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
