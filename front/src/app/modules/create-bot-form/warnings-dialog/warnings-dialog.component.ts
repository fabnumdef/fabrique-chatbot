import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-warnings-dialog',
  templateUrl: './warnings-dialog.component.html',
  styleUrls: ['./warnings-dialog.component.scss']
})
export class WarningsDialogComponent implements OnInit {

  isError: boolean;
  details: { [key: string]: string };

  constructor(public dialogRef: MatDialogRef<WarningsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isError = data.isError;
    this.details = data.details;
  }

  ngOnInit(): void {
  }

  getTitle(): string {
    if (this.isError) {
      return 'Liste des erreurs';
    }
    return 'Liste des avertissements';
  }

  returnKeyNumber(object: KeyValue<string, string>): number {
    return parseInt(object.key, 10);
  }

  get detailsLength() {
    return Object.keys(this.details).length;
  }
}
