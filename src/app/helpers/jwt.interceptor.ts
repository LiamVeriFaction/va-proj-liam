import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    const isApiUrl = request.url.startsWith('https://vaproj.itstudio.ie/api');
    if (isApiUrl) {
      this.authService.getCurrentUser().subscribe((user) => {

        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${user.access}`,
          },
        });
      });
    }
    return next.handle(request);
  }
}
