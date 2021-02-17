import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['liam', Validators.required],
      password: ['9ZmvnqK1G4rgPrTCJX', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.logout();
  }

  /**
   * Easy way to access formcontrols
   */
  public get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  /**
   * Perform login, if succesful navigate to main page
   */
  onSubmit() {
    this.authService
      .login(this.f.username.value, this.f.password.value)
      .subscribe((user) => {
        if (user) {
          this.snackBar.open('Login Successful');
          this.router.navigate(['/main']);
        }
      }),
      (error: any) => {
        console.log(error);
      };
  }
}
