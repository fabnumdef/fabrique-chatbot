import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@service/user.service';
import { User } from '@model/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(private _fb: FormBuilder,
              private _router: Router,
              private _route: ActivatedRoute,
              private _userService: UserService) {
  }

  ngOnInit() {
    this.initSignUpForm();
  }

  get controls() {
    return this.signUpForm.controls;
  }

  signUp() {
    if (!this.signUpForm.valid) {
      return;
    }
    this._userService.create(this.signUpForm.getRawValue()).subscribe((user: User) => {
      this._router.navigate(['./success'], {relativeTo: this._route, state: {email: user.email}});
    });
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private initSignUpForm() {
    this.signUpForm = this._fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [
        Validators.required,
        environment.production ? Validators.pattern('^[A-Za-z0-9._%+-]+@([A-Za-z0-9._%+-]*\\.)?gouv\\.fr$') : Validators.email,
        Validators.maxLength(200)
      ]],
      chatbotTheme: ['', [Validators.required, Validators.maxLength(50)]],
      acceptCGU: [false, [Validators.requiredTrue]],
    });
  }

}
