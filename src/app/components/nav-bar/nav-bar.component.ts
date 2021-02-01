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

  constructor(private authService : AuthenticationService, private userService : UserService) { }

  ngOnInit(): void {
  }

  isLoggedIn() : boolean{

    if (this.authService.loggedIn){
      this.currentUser = localStorage.getItem('username')!;
    }
  

    return this.authService.loggedIn;

  }



}
