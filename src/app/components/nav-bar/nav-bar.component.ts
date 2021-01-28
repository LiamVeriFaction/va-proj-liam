import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  currentUser!: string;
  user$! : Observable<User>;

  constructor(private authService : AuthenticationService, private userService : UserService) { }

  ngOnInit(): void {
    this.user$ = this.userService.getCurrentUser();
  }

  isLoggedIn() : boolean{

    if (this.authService.loggedIn){
      this.currentUser = localStorage.getItem('currentUser')!;
    }
  

    return this.authService.loggedIn;

  }



}
