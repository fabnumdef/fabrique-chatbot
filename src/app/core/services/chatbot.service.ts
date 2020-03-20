import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChatbotConfiguration, FileTemplateCheckResume } from '../models';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private _url: string;
  protected _loading$ = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient) {
    this._url = `${environment.api_endpoint}/chatbot`;
  }

  createChatbot(botConfig: ChatbotConfiguration): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', botConfig.file, botConfig.file.name);
    console.log(botConfig);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      reportProgress: true,
    };

    this._loading$.next(true);
    return this._http.post<FileTemplateCheckResume>(`${this._url}`, formData, options).pipe(
      finalize(() => {
        this._loading$.next(false);
      })
    );
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
    return this._http.post<FileTemplateCheckResume>(`${this._url}/check-file`, formData, options).pipe(
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
