import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileTemplateCheckResume } from '../models/file-template-check-resume.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private _url: string;
  protected _loading$ = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient) {
    this._url = `${environment.api_endpoint}/template-file`;
  }

  checkFile(file: File): Observable<FileTemplateCheckResume> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      reportProgress: true,
    };

    this._loading$.next(true);
    return this._http.post<FileTemplateCheckResume>(`${this._url}/check`, formData, options).pipe(
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
