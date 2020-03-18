import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private _url: string;
  protected _loading$ = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient) {
    this._url = `${environment.api_endpoint}/template-file`;
  }

  checkFile(file: File): Observable<string> {
    this._loading$.next(true);
    return this._http.post<string>(`${this._url}/check`, file).pipe(
      finalize(() => {
        this._loading$.next(false);
      })
    );
  }

  /************************
   ******** GETTER ********
   ************************/

  get loading$(): BehaviorSubject<boolean> {
    return this._loading$;
  }
}
