import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-launch-chatbot-update-dialog',
  templateUrl: './launch-chatbot-update-dialog.component.html',
  styleUrls: ['./launch-chatbot-update-dialog.component.scss']
})
export class LaunchChatbotUpdateDialogComponent implements OnInit {

  launchChatbotUpdateFormGroup: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this._initForm();
  }

  private _initForm() {
    this.launchChatbotUpdateFormGroup = this._fb.group({
      updateFront: [true],
      updateBack: [true],
      updateRasa: [false],
    });
  }

}
