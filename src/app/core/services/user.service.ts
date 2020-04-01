import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models';
import { finalize, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loading$ = new BehaviorSubject<boolean>(false);
  private _url = '';

  constructor(private _http: HttpClient) {
    this._url = `${environment.api_endpoint}/user`;
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
}
