import { Component, Inject, Input, OnInit } from '@angular/core';
import { UserRole } from '@enum/user-role.enum';
import { User } from '@model/user.model';
import { AuthService } from '@service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() showActions = true;

  user: User;
  isUserAdmin = false;

  constructor(private _auth: AuthService,
              @Inject(Window) public window: Window) {
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
