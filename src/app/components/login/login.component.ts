import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm! : FormGroup;
  username! : FormControl;
  password! : FormControl;


  constructor(private authService : AuthenticationService, private router: Router, private snackBar :MatSnackBar) {
   }

  ngOnInit(): void {
    localStorage.clear()
    this.authService.loggedIn = false;
    this.username = new FormControl('liam', Validators.required);
    this.password = new FormControl('9ZmvnqK1G4rgPrTCJX', Validators.required);

    this.loginForm = new FormGroup({
      username: this.username,
      password: this.password
    })
  }

  onSubmit(){

    this.authService.login(this.username.value, this.password.value).subscribe((user) => {
        if (user) {
            this.snackBar.open('Login Successful', '', {
                duration: 2000,
            });
            this.router.navigate(['/main']);
        }
    }),
        (error:any) => {
            console.log(error);
        };
  }

}
