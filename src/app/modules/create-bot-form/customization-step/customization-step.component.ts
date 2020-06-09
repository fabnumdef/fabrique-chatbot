import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-customization-step',
  templateUrl: './customization-step.component.html',
  styleUrls: ['./customization-step.component.scss']
})
export class CustomizationStepComponent implements OnInit {

  @Input() formGroup: FormGroup;
  icons = ['avion.png', 'bateau.png', 'camion.png', 'tank.png', 'parachute.png', 'femme.png', 'homme.png'];
  imgPreview = null;

  constructor(private _http: HttpClient,
              private _sanitizer: DomSanitizer) {
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
      this.imgPreview = this._sanitizer.bypassSecurityTrustResourceUrl(<string> reader.result);
    };
  }

}
