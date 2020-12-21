import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { WarningsDialogComponent } from '../warnings-dialog/warnings-dialog.component';
import { DestroyObservable } from '@utils/destroy-observable';
import { FileTemplateCheckResume } from '@model/file-template-check-resume.model';
import { ChatbotService } from '@service/chatbot.service';
import { ToastrService } from 'ngx-toastr';
import { ChatbotUserRole } from '@enum/chatbot-user-role.enum';

@Component({
  selector: 'app-file-check-step',
  templateUrl: './file-check-step.component.html',
  styleUrls: ['./file-check-step.component.scss']
})
export class FileCheckStepComponent extends DestroyObservable implements OnInit {

  @Input() formGroup: FormGroup;
  fileTemplateCheckResume: FileTemplateCheckResume;
  objectKeys = Object.keys;

  constructor(public chatbotService: ChatbotService,
              private dialog: MatDialog,
              private _fb: FormBuilder,
              private _toast: ToastrService) {
    super();
  }

  ngOnInit(): void {
  }

  get fileCtrl(): FormControl {
    return <FormControl> this.formGroup.get('file');
  }

  get usersFormArray(): FormArray {
    return <FormArray> this.formGroup.get('users');
  }

  uploadFile($event) {
    const file = $event.target.files[0];
    if (!file) {
      return;
    }
    const filesize = (file.size / 1024 / 1024);
    if (filesize > 10) {
      this._toast.error('Le poids du fichier doit être inférieur à 10Mb.', 'Fichier volumineux');
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

  addUser() {
    this.usersFormArray.push(this._fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.maxLength(255), Validators.email]],
      role: [ChatbotUserRole.writer, [Validators.required]]
    }));
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private checkFile(file: File) {
    this.chatbotService.checkFile(file).pipe(
      finalize(() => {
        this.fileCtrl.enable();
        if (this.hasFileErrors()) {
          this.fileCtrl.setErrors({'file_error': true});
        }
      })
    ).subscribe((response: FileTemplateCheckResume) => {
      this.fileTemplateCheckResume = response;
    }, error => {
      this.resetFile();
    });
  }

  get controls() {
    return this.formGroup.controls;
  }

  hasFileErrors() {
    return (Object.keys(this.fileTemplateCheckResume.errors).length > 0);
  }

  hasFileWarnings() {
    return (Object.keys(this.fileTemplateCheckResume.warnings).length > 0);
  }

  openDialog(isError: boolean, detailsArray: { [key: string]: string }): void {
    const dialogRef = this.dialog.open(WarningsDialogComponent, {
      width: '100%',
      height: '90%',
      data: {isError: isError, details: detailsArray}
    });
  }

}
