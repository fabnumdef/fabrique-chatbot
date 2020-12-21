import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  token$: Observable<string>;
  currentToken: string;

  constructor(private _authService: AuthService) {
    this.token$ = this._authService.token$;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token$.subscribe(res => this.currentToken = res);
    if (this.currentToken === null) {
      return next.handle(request);
    }

    request = request.clone({
      headers: request.headers.set('Authorization',
        'Bearer ' + this.currentToken)
    });
    return next.handle(request);
  }
}
