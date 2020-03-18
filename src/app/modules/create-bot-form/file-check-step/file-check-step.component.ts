import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { DestroyObservable } from '../../../core/utils/destroy-observable';
import { FileService } from '../../../core/services/file.service';

@Component({
  selector: 'app-file-check-step',
  templateUrl: './file-check-step.component.html',
  styleUrls: ['./file-check-step.component.scss']
})
export class FileCheckStepComponent extends DestroyObservable implements OnInit {

  @Input() formGroup: FormGroup;

  constructor(public fileService: FileService) {
    super();
  }

  ngOnInit(): void {
    this.watchFileInput();
  }

  get fileCtrl(): FormControl {
    return <FormControl> this.formGroup.get('fileCtrl');
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private watchFileInput() {
    this.fileCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe(file => {
        this.fileCtrl.disable();
        this.checkFile(file);
        console.log(file);
        this.fileCtrl.enable();
      });
  }

  private checkFile(file: File) {
    this.fileService.checkFile(file).pipe(
      finalize(() => {
        this.fileCtrl.enable();
      })
    );
  }

}
