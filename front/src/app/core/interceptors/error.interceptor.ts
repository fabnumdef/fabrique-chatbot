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
    this._showBackendMessage(err);
    if (err.status === 401) {
      // Clear session information as they are outdated
      sessionStorage.clear();
      this._router.navigate(['/auth/login']);
    }
  }

  private _showBackendMessage(err: HttpErrorResponse): void {
    const error: Error = err.error;
    const messageToShow = (error && error.message) ? this._generateErrorMessage(error.message) : 'Une erreur est survenue';
    this._toastr.error(messageToShow);
  }

  private _generateErrorMessage(errorMessage: any): string {
    if (typeof errorMessage === 'string') {
      return <string> errorMessage;
    }
    if (errorMessage instanceof Array) {
      let messageToReturn = '';
      errorMessage.forEach(e => {
        const keys = Object.keys(e.constraints);
        keys.forEach(k => {
          messageToReturn += e.constraints[k];
          messageToReturn += '.';
        });
      });
      return messageToReturn;
    }
    return 'Une erreur est survenue';
  }
}
