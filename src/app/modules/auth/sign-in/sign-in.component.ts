import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;
  hidePassword = true;

  constructor(private _fb: FormBuilder,
              private _auth: AuthService,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.initSignInForm();
  }

  get controls() {
    return this.signInForm.controls;
  }

  login() {
    if (!this.signInForm.valid) {
      return;
    }
    this._auth.authenticate(this.signInForm.getRawValue()).subscribe(() => {
      this._router.navigateByUrl('/create');
    });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private initSignInForm() {
    this.signInForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

}
