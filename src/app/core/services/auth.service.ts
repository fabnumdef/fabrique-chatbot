import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models';
import { Login } from '../models';
import { environment } from '../../../environments/environment';
import { finalize, tap } from 'rxjs/operators';
import { ResetPassword } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _tokenName = 'chatbotFactoryToken';
  private _userSession = 'user';

  private _token$ = new BehaviorSubject<string>(null);
  private _authenticating$ = new BehaviorSubject<boolean>(false);

  private _url = '';

  constructor(private _http: HttpClient) {
    this._url = `${environment.api_endpoint}/auth`;
    this.readToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  public get authenticating$(): Observable<boolean> {
    return this._authenticating$;
  }

  public get token$() {
    return this._token$;
  }

  public get token() {
    return this._token$.value;
  }

  public authenticate(login: Login): Observable<any> {
    this._authenticating$.next(true);
    return this._http.post<any>(`${this._url}/login`, login).pipe(
      tap(res => {
        this._token$.next(res.chatbotFactoryToken);
        sessionStorage.setItem(this._tokenName, res.chatbotFactoryToken);
        sessionStorage.setItem(this._userSession, JSON.stringify(res.user));
      }),
      finalize(() => this._authenticating$.next(false))
    );
  }

  public resetPassword(resetPassword: ResetPassword): Observable<any> {
    return this._http.post<any>(`${this._url}/reset-password`, resetPassword);
  }

  public forgotPassword(email: string): Observable<any> {
    return this._http.post<any>(`${this._url}/reset-password/${email}`, {});
  }

  public logout(): void {
    sessionStorage.clear();
    this._token$.next(null);
  }

  public getCurrentUser(): User {
    const str = sessionStorage.getItem(this._userSession);
    return JSON.parse(str);
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private readToken() {
    const token = sessionStorage.getItem(this._tokenName);
    if (token) {
      this.token$.next(token);
    }
  }
}
