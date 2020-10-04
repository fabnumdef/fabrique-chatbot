import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) {
    return this._canActivate(route, state);
  }

  canActivateChild(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) {
    return this._canActivate(route, state);
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private _canActivate(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) {
    const isAuthPage = state.url.includes('/auth');
    if (!this.authService.isAuthenticated() && !isAuthPage) {
      this.router.navigate(['/auth/login']);
      return false;
    } else if (this.authService.isAuthenticated() && isAuthPage) {
      this.router.navigate(['/create']);
      return false;
    }
    return true;
  }
}
