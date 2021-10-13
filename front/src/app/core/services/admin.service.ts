import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _url: string;
  protected _loading$ = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient) {
    this._url = `${environment.api_endpoint}/admin`;
  }

  generateIntranetPackage(): Observable<any[]> {
    this._loading$.next(true);
    return this._http.post<any>(`${this._url}/intranet`, {}).pipe(
      finalize(() => {
        this._loading$.next(false);
      })
    );
  }
}
