import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services';
import { UserRole } from '../../enums/user-role.enum';
import { User } from '../../models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User;
  isUserAdmin = false;

  constructor(private _auth: AuthService) {
  }

  ngOnInit(): void {
    this._auth.user$.subscribe(user => {
      this.user = user;
      this.isUserAdmin = user && user.role === UserRole.admin;
    });
  }

  logout(): void {
    this._auth.logout();
  }

}
