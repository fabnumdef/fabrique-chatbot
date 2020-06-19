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

  constructor(private readonly _http: HttpService) {
    this._connection();
  }

  /**
   * Get file from object storage
   * @param filePath
   */
  public async get(filePath: string): Promise<any> {
    await this._retryConnection();
    const targetURL = `${this._endpoint}/${filePath}`;
    return this._http.get(targetURL, this._setHeaders()).pipe(
      tap(() => {
        console.log(`${new Date().toLocaleString()} - GET OBJECT STORAGE - ${filePath}`);
      }),
      map(
        r => r.data
      ),
      catchError(err => {
        console.error(`${new Date().toLocaleString()} - FAIL - GET OBJECT STORAGE - ${filePath} - ${err.message}`);
        return err;
      })
    ).toPromise();
  }

  /**
   * Put file on object storage
   * @param file
   * @param filePath
   */
  public async set(file: any, filePath: string): Promise<any> {
    await this._retryConnection();
    const targetURL = `${this._endpoint}/${filePath}`;
    return this._http.put(targetURL, file, this._setHeaders()).pipe(
      tap(() => {
        console.log(`${new Date().toLocaleString()} - SET OBJECT STORAGE - ${filePath}`);
      }),
      map(
        r => r.data
      ),
      catchError(err => {
        console.error(`${new Date().toLocaleString()} - FAIL - SET OBJECT STORAGE - ${filePath} - ${err.message}`);
        return err;
      })
    ).toPromise();
  }

  /**
   * List objects in a container
   * @param dirPath
   */
  public async list(dirPath?: string): Promise<any> {
    await this._retryConnection();
    const targetURL = `${this._endpoint}${dirPath ? `?prefix=${dirPath}` : ''}`;
    return this._http.get(targetURL, this._setHeaders()).pipe(
      map(r => r.data),
      tap((data) => {
        console.log(`${new Date().toLocaleString()} - GET LIST OBJECT STORAGE - ${dirPath}`);
      }),
      catchError(err => {
        console.error(`${new Date().toLocaleString()} - FAIL - GET LIST OBJECT STORAGE - ${dirPath} - ${err.message}`);
        return err;
      })
    ).toPromise();
  }

  /************************************************************************************ PRIVATE FUNCTIONS ************************************************************************************/

  private async _connection() {
    const body = {
      auth: {
        passwordCredentials: {
          username: this._config.username,
          password: this._config.password
        },
        tenantId: this._config.tenantId
      }
    };
    await this._http.post(`${this._config.authURL}/tokens`, body).toPromise().then(res => {
      this._token = res.data.access.token;
      const serviceCatalog = res.data.access.serviceCatalog.find(s => s.type === 'object-store');
      this._endpoint = `${serviceCatalog.endpoints.find(e => e.region === this._config.region).publicURL}/${this._config.container}`;
      console.log(`${new Date().toLocaleString()} - CONNECTED TO OVH OBJECT STORAGE`);
    }, err => {
      console.error(`${new Date().toLocaleString()} - FAILED TO CONNECT TO OVH OBJECT STORAGE - `, err.message);
    });
  }

  private _setHeaders() {
    return {
      headers: {
        'X-Auth-Token': this._token?.id
      }
    }
  }

  // If token is expired
  private async _retryConnection() {
    const tokenExpires = new Date(this._token?.expires).getTime() < new Date().getTime();
    if(!tokenExpires) {
      return;
    }
    await this._connection();
  }

}
