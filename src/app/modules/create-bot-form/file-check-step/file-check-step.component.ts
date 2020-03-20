import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, filter, finalize, takeUntil, tap } from 'rxjs/operators';
import { DestroyObservable } from '../../../core/utils/destroy-observable';
import { FileInput } from 'ngx-material-file-input';
import { FileTemplateCheckResume } from '../../../core/models/file-template-check-resume.model';
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
    this.watchFileInput();
  }

  get fileCtrl(): FormControl {
    return <FormControl> this.formGroup.get('fileInput');
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private watchFileInput() {
    this.fileCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap(() => {
          this.fileTemplateCheckResume = null;
        }),
        filter((fileInput: FileInput) => fileInput && fileInput.files.length > 0)
      )
      .subscribe((fileInput: FileInput) => {
        this.fileCtrl.disable();
        this.checkFile(fileInput.files[0]);
      });
  }

  private checkFile(file: File) {
    this.chatbotService.checkFile(file).pipe(
      finalize(() => {
        this.fileCtrl.enable();
      })
    ).subscribe((response: FileTemplateCheckResume) => {
      this.fileTemplateCheckResume = response;
    });
  }

}
