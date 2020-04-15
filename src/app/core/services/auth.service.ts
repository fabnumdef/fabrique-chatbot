import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { finalize, tap } from 'rxjs/operators';
import { ResetPassword } from '@model/reset-password.model';
import { Router } from '@angular/router';
import { User } from '@model/user.model';
import { Login } from '@model/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _tokenName = 'chatbotFactoryToken';
  private _userSession = 'user';

  private _token$ = new BehaviorSubject<string>(null);
  private _user$ = new BehaviorSubject<User>(null);
  private _authenticating$ = new BehaviorSubject<boolean>(false);

  private _url = '';

  constructor(private _http: HttpClient,
              private _router: Router) {
    this._url = `${environment.api_endpoint}/auth`;
    this.readToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  public authenticate(login: Login): Observable<any> {
    this._authenticating$.next(true);
    return this._http.post<any>(`${this._url}/login`, login).pipe(
      tap(res => {
        this._token$.next(res.chatbotFactoryToken);
        this._user$.next(res.user);
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
    this._user$.next(null);
    this._router.navigateByUrl('');
  }

  /**
   * PRIVATE FUNCTIONS
   */

  private readToken() {
    const token = sessionStorage.getItem(this._tokenName);
    if (token) {
      this.token$.next(token);
    }
    const user = sessionStorage.getItem(this._userSession);
    if (user) {
      this.user$.next(JSON.parse(user));
    }
  }

  /**
   * GETTERS
   */

  public get authenticating$(): Observable<boolean> {
    return this._authenticating$;
  }

  public get token$(): BehaviorSubject<string> {
    return this._token$;
  }

  public get token(): string {
    return this._token$.value;
  }

  public get user$(): BehaviorSubject<User> {
    return this._user$;
  }

  public get user(): User {
    return this._user$.value;
  }
}
