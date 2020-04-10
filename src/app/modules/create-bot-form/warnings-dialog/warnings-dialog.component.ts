import { Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    type: string;
    details: Array<string>;
  }
@Component({
  selector: 'app-warnings-dialog',
  templateUrl: './warnings-dialog.component.html',
  styleUrls: ['./warnings-dialog.component.scss']
})
export class WarningsDialogComponent implements OnInit {

  type: string;
  details: Array<string>;

  constructor(public dialogRef: MatDialogRef<WarningsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.type = data.type;
      this.details = data.details;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  returnZero() {
    return 0;
    }
}
