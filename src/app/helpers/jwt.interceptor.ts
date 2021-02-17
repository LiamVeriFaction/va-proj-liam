import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { mergeMap, take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isApiUrl = request.url.startsWith('https://vaproj.itstudio.ie/api');

    if (!isApiUrl) {
      return next.handle(request);
    }

    //Interceptor used on correct APICalls
    return this.authService.getCurrentSession().pipe(
      take(1),
      mergeMap((session) => {
        if (session && session.access) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${session?.access}`,
            },
          });
        }
        return next.handle(request);
      })
    );
  }
}
