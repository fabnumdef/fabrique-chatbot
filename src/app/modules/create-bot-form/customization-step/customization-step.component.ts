import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customization-step',
  templateUrl: './customization-step.component.html',
  styleUrls: ['./customization-step.component.scss']
})
export class CustomizationStepComponent implements OnInit {

  @Input() formGroup: FormGroup;
  icons = ['AIR.png', 'MARINE.png', 'TERRE.png', 'TERRE_BIS.png', 'AIR_BIS.png', 'FACE_1.png', 'FACE_2.png'];
  imgPreview = null;

  constructor(private _http: HttpClient) {
  }

  ngOnInit(): void {
  }

  get controls() {
    return this.formGroup.controls;
  }

  uploadIcon($event) {
    const file = $event.target.files[0];
    if (!file) {
      return;
    }
    this._storeIcon(file);
    $event.target.value = '';
  }

  selectIcon(iconName: string) {
    this._http.get('assets/img/icons/' + iconName, { responseType: 'blob' }).subscribe((file: any) => {
      file.name = iconName;
      this._storeIcon(file);
    });
  }

  resetIconFile() {
    this.imgPreview = null;
    this.controls.icon.setValue(null);
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private _storeIcon(file: any) {
    this.imgPreview = null;
    this.controls.icon.setValue(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imgPreview = reader.result;
    };
  }

}
