import { HttpService, Injectable } from '@nestjs/common';
import { catchError, map, tap } from "rxjs/operators";

@Injectable()
export class OvhStorageService {
  private _config = {
    username: process.env.OBJECT_STORAGE_USER,
    password: process.env.OBJECT_STORAGE_PASSWORD,
    authURL: 'https://auth.cloud.ovh.net/v2.0',
    tenantId: process.env.OBJECT_STORAGE_ID,
    region: process.env.OBJECT_STORAGE_REGION,
    container: process.env.OBJECT_STORAGE_CONTAINER_NAME
  };

  private _token;
  private _endpoint: string;

  constructor(private _http: HttpService) {
    this._connection();
  }

  /**
   * Get file from object storage
   * @param filePath
   */
  public get(filePath: string): Promise<any> {
    const targetURL = `${this._endpoint}/${filePath}`;
    return this._http.get(targetURL, this._setHeaders()).pipe(
      tap(() => {
        console.log(`GET OBJECT STORAGE - ${filePath}`);
      }),
      map(
        r => r.data
      ),
      catchError(err => {
        console.error(`FAIL - GET OBJECT STORAGE - ${filePath} - ${err.message}`);
        return err;
      })
    ).toPromise();
  }

  /**
   * Put file on object storage
   * @param file
   * @param filePath
   */
  public set(file: any, filePath: string): Promise<any> {
    const targetURL = `${this._endpoint}/${filePath}`;
    return this._http.put(targetURL, file, this._setHeaders()).pipe(
      tap(() => {
        console.log(`SET OBJECT STORAGE - ${filePath}`);
      }),
      map(
        r => r.data
      ),
      catchError(err => {
        console.error(`FAIL - SET OBJECT STORAGE - ${filePath} - ${err.message}`);
        return err;
      })
    ).toPromise();
  }

  /**
   * List objects in a container
   * @param dirPath
   */
  public list(dirPath?: string): Promise<any> {
    const targetURL = `${this._endpoint}${dirPath ? `?prefix=${dirPath}` : ''}`;
    return this._http.get(targetURL, this._setHeaders()).pipe(
      map(r => r.data),
      tap((data) => {
        console.log(`GET LIST OBJECT STORAGE - ${dirPath}`);
      }),
      catchError(err => {
        console.error(`FAIL - GET LIST OBJECT STORAGE - ${dirPath} - ${err.message}`);
        return err;
      })
    ).toPromise();
  }

  /************************************************************************************ PRIVATE FUNCTIONS ************************************************************************************/

  private _connection() {
    const body = {
      auth: {
        passwordCredentials: {
          username: this._config.username,
          password: this._config.password
        },
        tenantId: this._config.tenantId
      }
    };
    this._http.post(`${this._config.authURL}/tokens`, body).subscribe(res => {
      this._token = res.data.access.token;
      const serviceCatalog = res.data.access.serviceCatalog.find(s => s.type === 'object-store');
      this._endpoint = `${serviceCatalog.endpoints.find(e => e.region === this._config.region).publicURL}/${this._config.container}`;
      console.log('CONNECTED TO OVH OBJECT STORAGE');
    }, err => {
      console.error('FAILED TO CONNECT TO OVH OBJECT STORAGE - ', err.message);
    });
  }

  private _setHeaders() {
    return {
      headers: {
        'X-Auth-Token': this._token.id
      }
    }
  }

}
