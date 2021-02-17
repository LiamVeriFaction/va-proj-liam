import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  private returnUrl = '/main';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['liam', Validators.required],
      password: ['9ZmvnqK1G4rgPrTCJX', Validators.required],
    });
  }

  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParams.returnUrl || this.returnUrl;
  }

  /**
   * Convenience getter for easy access to login form fields
   */
  public get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  /**
   * Perform the user login with the input username and password
   */
  public onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.f.username.value, this.f.password.value)
      .subscribe(
        () => {
          this.snackBar.open('Login Successful');
          this.router.navigate([this.returnUrl]);
        },
        (error: any) => console.log(error)
      );
  }
}
