import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatbotUserRole_Fr } from '@enum/chatbot-user-role.enum';

@Component({
  selector: 'app-resume-step',
  templateUrl: './resume-step.component.html',
  styleUrls: ['./resume-step.component.scss']
})
export class ResumeStepComponent implements OnInit {

  @Input() formArray: UntypedFormArray;
  @Input() chatbotGenerated: boolean;
  iconPreview;
  chatbotUserRole_Fr = ChatbotUserRole_Fr;

  constructor(private _sanitizer: DomSanitizer) {
  }

  get iconControl(): UntypedFormControl {
    return <UntypedFormControl> (<UntypedFormGroup> this.formArray.at(2)).controls.icon;
  }

  get conditionControl(): UntypedFormControl {
    return <UntypedFormControl> (<UntypedFormGroup> this.formArray.at(3)).controls.acceptConditions;
  }

  ngOnInit(): void {
    this.iconControl.valueChanges.subscribe(() => {
      this._generateIconPreview();
    });
  }

  private _generateIconPreview() {
    this.iconPreview = null;
    const file = this.iconControl.value;

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.iconPreview = this._sanitizer.bypassSecurityTrustResourceUrl(<string> reader.result);
    };
  }
}
