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

    //Interceptor used on correct APICalls and once logged in
    if (isApiUrl && this.authService.currentSessionSubject.value.access) {
      let token = this.authService.currentSessionSubject.value;
      //Add token to every http request
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.access}`,
        },
      });
    }
    return next.handle(request);
  }
}
