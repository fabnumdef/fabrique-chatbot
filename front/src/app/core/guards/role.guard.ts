import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

  constructor(private _authService: AuthService) {
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
    const expectedRole = route.data.expectedRole;
    const user = this._authService.user;

    return this._authService.isAuthenticated() && user.role === expectedRole;
  }
}
