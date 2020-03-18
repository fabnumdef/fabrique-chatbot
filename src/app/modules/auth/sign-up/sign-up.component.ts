import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(private _fb: FormBuilder,
              private _router: Router,
              private _route: ActivatedRoute) { }

  ngOnInit() {
    this.initSignUpForm();
  }

  get controls() {
    return this.signUpForm.controls;
  }

  signUp() {
    // CALL TO SERVICE /auth/signup ? with form value
    this._router.navigate(['./success'], {relativeTo: this._route, state: {email: 'vincent@laine.xyz'}});
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private initSignUpForm() {
    this.signUpForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
    });
  }

}
