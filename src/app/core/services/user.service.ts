import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '@model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loading$ = new BehaviorSubject<boolean>(false);
  private _url: string;
  private _adminUrl: string;

  constructor(private _http: HttpClient) {
    this._url = `${environment.api_endpoint}/user`;
    this._adminUrl = `${environment.api_endpoint}/admin/user`;
  }

  public get loading$(): Observable<boolean> {
    return this._loading$;
  }

  public create(user: User): Observable<User> {
    this._loading$.next(true);
    return this._http.post<User>(`${this._url}`, user).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  public delete(userEmail: string): Observable<any> {
    this._loading$.next(true);
    return this._http.delete<User>(`${this._url}/${userEmail}`,).pipe(
      finalize(() => this._loading$.next(false))
    );
  }

  public getUsers(): Observable<User[]> {
    this._loading$.next(true);
    return this._http.get<any>(`${this._adminUrl}`).pipe(
      finalize(() => {
        this._loading$.next(false);
      })
    );
  }
}
