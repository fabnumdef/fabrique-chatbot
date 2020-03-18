import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

  canActivateChild(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
