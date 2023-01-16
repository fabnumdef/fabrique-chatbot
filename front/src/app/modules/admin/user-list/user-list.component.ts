import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '@service/user.service';
import { User } from '@model/user.model';
import { AuthService } from '@service/auth.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { filter } from 'rxjs/operators';
import { UserRole } from '@enum/user-role.enum';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns = ['id', 'email', 'firstname', 'lastname', 'role', 'createdAt', 'actions'];
  users$: BehaviorSubject<User[]>;
  loading$: Observable<boolean>;

  constructor(private _userService: UserService,
              private _authService: AuthService,
              private _dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loading$ = this._userService.loading$;
    this.users$ = this._userService.entities$;
    this._loadChatbots();
  }

  isUserAdmin(user: User) {
    return user.role === UserRole.admin;
  }

  isCurrentUser(user: User) {
    return this._authService.user.email === user.email;
  }

  changeUserRole(user: User) {
    const futureRole = user.role === UserRole.admin ? UserRole.user : UserRole.admin;
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Êtes-vous sûr de vouloir changer le rôle de l'utilsateur <b>${user.firstName} ${user.lastName}</b> ?
<br/>Celui-ci aura comme rôle ${futureRole}.`
      },
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe(() => {
        this._userService.update(user.email, {role: futureRole}).subscribe();
      });
  }

  deleteUser(user: User) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Êtes-vous sûr de vouloir supprimer l'utilsateur <b>${user.firstName} ${user.lastName}</b> ?
<br/>Cette action est irréversible.`
      },
      autoFocus: false
    });

    dialogRef.afterClosed()
      .pipe(filter(r => !!r))
      .subscribe(() => {
        this._userService.delete(user.email).subscribe();
      });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private _loadChatbots() {
    this._userService.getUsers().subscribe();
  }

}
