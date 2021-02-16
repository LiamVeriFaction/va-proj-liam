import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSession } from 'src/app/models/user-session';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  currentUserSession$: Observable<UserSession>;

  constructor(private authService: AuthenticationService) {
    this.currentUserSession$ = this.authService.currentSession$;
  }
}
