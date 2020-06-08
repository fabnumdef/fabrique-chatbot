import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { finalize } from 'rxjs/operators';
import { Chatbot } from '@model/chatbot.model';
import { ChatbotConfiguration } from '@model/chatbot-configuration.model';
import { FileTemplateCheckResume } from '@model/file-template-check-resume.model';
import { ChatbotLaunchUpdate } from '@model/chatbot-launch-update.model';
import { ChatbotUpdate } from '@model/chatbot-update.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private _url: string;
  private _adminUrl: string;
  protected _loading$ = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient) {
    this._url = `${environment.api_endpoint}/chatbot`;
    this._adminUrl = `${environment.api_endpoint}/admin/chatbot`;
  }

  createChatbot(botConfig: ChatbotConfiguration): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', botConfig.file, botConfig.file.name);
    formData.append('icon', botConfig.icon, botConfig.icon.name);
    formData.append('name', botConfig.name);
    formData.append('function', botConfig.function);
    formData.append('primaryColor', botConfig.primaryColor);
    formData.append('secondaryColor', botConfig.secondaryColor);
    formData.append('problematic', botConfig.problematic);
    formData.append('audience', botConfig.audience);
    formData.append('solution', botConfig.solution);
    formData.append('intraDef', botConfig.intraDef.toString());
    formData.append('users', JSON.stringify(botConfig.users));

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = {
      headers: headers,
      reportProgress: true,
    };

    this._loading$.next(true);
    return this._http.post<FileTemplateCheckResume>(`${this._url}/create`, formData, options).pipe(
      finalize(() => {
        this._loading$.next(false);
      })
    );
  }

  updateChatbot(chatbotId: number, body: ChatbotUpdate) {
    this._loading$.next(true);
    console.log(body);
    return this._http.put<any>(`${this._adminUrl}/${chatbotId}`, body).pipe(
      finalize(() => {
        this._loading$.next(false);
      })
    );
  }

  launchUpdateChatbot(chatbotId: number, body: ChatbotLaunchUpdate): Observable<any> {
    this._loading$.next(true);
    return this._http.post<any>(`${this._adminUrl}/update/${chatbotId}`, body).pipe(
      finalize(() => {
        this._loading$.next(false);
      })
    );
  }

  getChatbots(): Observable<Chatbot[]> {
    this._loading$.next(true);
    return this._http.get<any>(`${this._adminUrl}`).pipe(
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
