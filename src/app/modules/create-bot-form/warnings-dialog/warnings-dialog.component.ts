import { Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-warnings-dialog',
  templateUrl: './warnings-dialog.component.html',
  styleUrls: ['./warnings-dialog.component.scss']
})
export class WarningsDialogComponent implements OnInit {

  type: string;
  details: { [key: string]: string };

  constructor(public dialogRef: MatDialogRef<WarningsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
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
