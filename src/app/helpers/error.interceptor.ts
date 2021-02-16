import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  //Catches any HTTP errors and displays them
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        switch (err.status) {
          case 401:
            this.snackBar.open('Incorrect Login Ingo', '', {
              duration: 2000,
            });
            this.router.navigate(['/login']);
            break;
          case 404:
            this.snackBar.open('Error 404', '', {
              duration: 2000,
            });
            this.router.navigate(['/main']);
            break;
          case 500:
            this.snackBar.open('Error 500', '', {
              duration: 2000,
            });
            this.router.navigate(['/main']);
            break;
          case 502:
            this.snackBar.open('Error 502', '', {
              duration: 2000,
            });
            this.router.navigate(['/main']);
            break;
          case 503:
            this.snackBar.open('Error 503', '', {
              duration: 2000,
            });
            this.router.navigate(['/main']);
            break;
          default:
            this.snackBar.open('Error 404', '', {
              duration: 2000,
            });
            this.router.navigate(['/main']);
            break;
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
