import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up-success',
  templateUrl: './sign-up-success.component.html',
  styleUrls: ['./sign-up-success.component.scss']
})
export class SignUpSuccessComponent implements OnInit {

  email: string;

  constructor() { }

  ngOnInit(): void {
    this.email = history.state.email;
  }

}
