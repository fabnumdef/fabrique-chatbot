import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { WarningsDialogComponent } from '../warnings-dialog/warnings-dialog.component';
import { DestroyObservable } from '@utils/destroy-observable';
import { FileTemplateCheckResume } from '@model/file-template-check-resume.model';
import { ChatbotService } from '@service/chatbot.service';

interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-file-check-step',
  templateUrl: './file-check-step.component.html',
  styleUrls: ['./file-check-step.component.scss']
})
export class FileCheckStepComponent extends DestroyObservable implements OnInit {

  @Input() formGroup: FormGroup;
  fileTemplateCheckResume: FileTemplateCheckResume;
  objectKeys = Object.keys;

  roles: Role[] = [
    {value: 'role-0', viewValue: 'Rôle A'},
    {value: 'role-1', viewValue: 'Rôle B'},
    {value: 'role-2', viewValue: 'Rôle C'}
  ];

  constructor(public chatbotService: ChatbotService,
              private dialog: MatDialog) {
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

  get controls() {
    return this.formGroup.controls;
  }

  hasFileErrors() {
    return (Object.keys(this.fileTemplateCheckResume.errors).length > 0);
  }

  hasFileWarnings() {
    return (Object.keys(this.fileTemplateCheckResume.warnings).length > 0);
  }

  openDialog(type: string, detailsArray: { [key: string]: string }): void {
    const dialogRef = this.dialog.open(WarningsDialogComponent, {
      width: '100%',
      height: '90%',
      data: {type: type, details: detailsArray}
    });
  }

}
