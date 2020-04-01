import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private _router: Router,
              private _authService: AuthService,
              private _toastr: ToastrService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      this.handleErrorResponse(err);
      return throwError(err);
    }));
  }

  private handleErrorResponse(err: HttpErrorResponse) {
    this.showBackendMessage(err);
    if (err.status === 401) {
      // Clear session information as they are outdated
      sessionStorage.clear();
      this._router.navigate(['/auth/login']);
    }
  }

  private showBackendMessage(err: HttpErrorResponse): void {
    const error: Error = err.error;
    const messageToShow = (error && error.message) ? error.message : 'Une erreur est survenue';
    this._toastr.error(messageToShow);
  }
}
