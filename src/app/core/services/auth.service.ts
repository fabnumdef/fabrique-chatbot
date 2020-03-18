import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { environment } from '../../../environments/environment';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _tokenName = 'user-token';
  private _userSession = 'user';

  private _token$ = new BehaviorSubject<string>(null);
  private _authenticating$ = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient) {
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

  public authenticate(login: Login) {
    this._authenticating$.next(true);

    const url = `${environment.api_endpoint}/auth`;
    return this._http.post<any>(`${url}/login`, login).pipe(
      tap(res => {
        this._token$.next(res.chatbotFactoryToken);
        sessionStorage.setItem(this._tokenName, res.chatbotFactoryToken);
        sessionStorage.setItem(this._userSession, JSON.stringify(res.user));
      }),
      finalize(() => this._authenticating$.next(false))
    );
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
