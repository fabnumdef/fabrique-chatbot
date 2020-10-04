import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password-success',
  templateUrl: './forgot-password-success.component.html',
  styleUrls: ['./forgot-password-success.component.scss']
})
export class ForgotPasswordSuccessComponent implements OnInit {

  email: string;

  constructor() { }

  ngOnInit(): void {
    this.email = history.state.email;
  }

}
