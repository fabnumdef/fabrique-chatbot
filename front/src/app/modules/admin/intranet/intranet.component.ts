import { Component, OnInit } from '@angular/core';
import { AdminService } from '@service/admin.service';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.scss']
})
export class IntranetComponent implements OnInit {

  constructor(private _adminService: AdminService) { }

  ngOnInit(): void {
  }

  generateIntranetPackage() {
    this._adminService.generateIntranetPackage().subscribe();
  }

}
