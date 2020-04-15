import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(private _fb: FormBuilder,
              private _auth: AuthService,
              private _route: ActivatedRoute,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.initForgotPasswordForm();
  }

  get controls() {
    return this.forgotPasswordForm.controls;
  }

  forgotPassword() {
    if (!this.forgotPasswordForm.valid) {
      return;
    }
    this._auth.forgotPassword(this.controls.email.value).subscribe(() => {
      this._router.navigate(['./success'], {relativeTo: this._route, state: {email: this.controls.email.value}});
    });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private initForgotPasswordForm() {
    this.forgotPasswordForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

}
