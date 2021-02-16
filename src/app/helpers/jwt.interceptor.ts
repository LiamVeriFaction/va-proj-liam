import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (!isApiUrl) {
      return next.handle(request);
    }

    return this.authService.currentSession$.pipe(
      // The `currentSession$` is built from a behaviour subject, so it will have an immediate emit
      // being the last value stored on the subject. So we will get the user-session object, then we
      // `take` that first emit (count of one) and the take *completes the stream*.
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
