import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.initSignUpForm();
  }

  get controls() {
    return this.signUpForm.controls;
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
