import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-bot-form',
  templateUrl: './create-bot-form.component.html',
  styleUrls: ['./create-bot-form.component.scss']
})
export class CreateBotFormComponent implements OnInit {

  createBotForm: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  get formArray(): FormArray | null {
    return <FormArray> this.createBotForm.get('formArray');
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private initForm() {
    this.createBotForm = this._fb.group({
      formArray: this._fb.array([
        this._fb.group({
          file: ['', Validators.required],
        }),
        this._fb.group({
          name: ['', Validators.required],
          icon: [null, Validators.required],
          primaryColor: ['#207fef', Validators.required],
          secondaryColor: ['#e20613', Validators.required],
        }),
      ])
    });
  }

}
