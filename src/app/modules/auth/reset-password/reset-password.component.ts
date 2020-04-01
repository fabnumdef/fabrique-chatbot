import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from '../../../core/models/reset-password.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  hidePassword = true;
  hideCheckPassword = true;
  token;

  constructor(private _fb: FormBuilder,
              private _auth: AuthService,
              private _route: ActivatedRoute,
              private _router: Router) {
    this._route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  ngOnInit(): void {
    this.initResetPasswordForm();
  }

  get controls() {
    return this.resetPasswordForm.controls;
  }

  resetPassword() {
    const resetPassword: ResetPassword = {
      password: this.controls.password.value,
      token: this.token
    };
    this._auth.resetPassword(resetPassword).subscribe(() => {
      this._router.navigate(['./success'], {relativeTo: this._route});
    });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private initResetPasswordForm() {
    this.resetPasswordForm = this._fb.group({
      password: ['', [Validators.required]],
      checkPassword: ['', Validators.required],
    }, {validator: this.checkPasswords});
  }

  private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('checkPassword').value;
    if (!confirmPass) {
      return;
    }

    const error = {notSame: true};
    const same = pass === confirmPass;
    same ? group.get('checkPassword').setErrors(null) : group.get('checkPassword').setErrors(error);
    return same ? null : error;
  }

}
