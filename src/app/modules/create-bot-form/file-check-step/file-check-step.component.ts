import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { DestroyObservable } from '../../../core/utils/destroy-observable';
import { FileTemplateCheckResume } from '../../../core/models';
import { ChatbotService } from '../../../core/services';

@Component({
  selector: 'app-file-check-step',
  templateUrl: './file-check-step.component.html',
  styleUrls: ['./file-check-step.component.scss']
})
export class FileCheckStepComponent extends DestroyObservable implements OnInit {

  @Input() formGroup: FormGroup;
  fileTemplateCheckResume: FileTemplateCheckResume;
  objectKeys = Object.keys;

  constructor(public chatbotService: ChatbotService) {
    super();
  }

  ngOnInit(): void {
  }

  get fileCtrl(): FormControl {
    return <FormControl> this.formGroup.get('file');
  }

  uploadFile($event) {
    const file = $event.target.files[0];
    if (!file) {
      return;
    }
    this.fileTemplateCheckResume = null;
    this.fileCtrl.setValue(file);
    this.fileCtrl.disable();
    this.checkFile(file);
    $event.target.value = '';
  }

  resetFile() {
    this.fileTemplateCheckResume = null;
    this.fileCtrl.setValue(null);
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private checkFile(file: File) {
    this.chatbotService.checkFile(file).pipe(
      finalize(() => {
        this.fileCtrl.enable();
      })
    ).subscribe((response: FileTemplateCheckResume) => {
      this.fileTemplateCheckResume = response;
    }, error => {
      this.resetFile();
    });
  }

}
