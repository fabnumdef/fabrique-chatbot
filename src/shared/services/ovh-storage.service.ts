import { HttpService, Injectable } from '@nestjs/common';
import { catchError, map, tap } from "rxjs/operators";

@Injectable()
export class OvhStorageService {
  private _config = {
    username: process.env.OBJECT_STORAGE_USER,
    password: process.env.OBJECT_STORAGE_PASSWORD,
    authURL: 'https://auth.cloud.ovh.net/v3',
    tenantId: process.env.OBJECT_STORAGE_ID,
    region: process.env.OBJECT_STORAGE_REGION,
    container: process.env.OBJECT_STORAGE_CONTAINER_NAME
  };

  private _token: string;
  private _endpoint: string;

  constructor(private readonly _http: HttpService) {
    this._connection();
  }

  /**
   * Get file from object storage
   * @param filePath
   * @param retry
   */
  public async get(filePath: string, retry = false): Promise<any> {
    console.log(this._endpoint);
    const targetURL = `${this._endpoint}/${filePath}`;
    return this._http.get(targetURL, this._setHeaders()).pipe(
      tap(() => {
        console.log(`${new Date().toLocaleString()} - GET OBJECT STORAGE - ${filePath}`);
      }),
      map(
        r => r.data
      ),
      catchError(err => {
        if(!retry) {
          return this.get(filePath, true);
        }
        console.error(`${new Date().toLocaleString()} - FAIL - GET OBJECT STORAGE - ${filePath} - ${err.message}`);
        return err;
      })
    ).toPromise();
  }

  /**
   * Put file on object storage
   * @param file
   * @param filePath
   * @param retry
   */
  public async set(file: any, filePath: string, retry = false): Promise<any> {
    const targetURL = `${this._endpoint}/${filePath}`;
    return this._http.put(targetURL, file, this._setHeaders()).pipe(
      tap(() => {
        console.log(`${new Date().toLocaleString()} - SET OBJECT STORAGE - ${filePath}`);
      }),
      map(
        r => r.data
      ),
      catchError(err => {
        if(!retry) {
          return this.set(file, filePath, true);
        }
        console.error(`${new Date().toLocaleString()} - FAIL - SET OBJECT STORAGE - ${filePath} - ${err.message}`);
        return err;
      })
    ).toPromise();
  }

  /**
   * List objects in a container
   * @param dirPath
   * @param retry
   */
  public async list(dirPath?: string, retry = false): Promise<any> {
    const targetURL = `${this._endpoint}${dirPath ? `?prefix=${dirPath}` : ''}`;
    return this._http.get(targetURL, this._setHeaders()).pipe(
      map(r => r.data),
      tap((data) => {
        console.log(`${new Date().toLocaleString()} - GET LIST OBJECT STORAGE - ${dirPath}`);
      }),
      catchError(err => {
        if(!retry) {
          return this.list(dirPath, true);
        }
        console.error(`${new Date().toLocaleString()} - FAIL - GET LIST OBJECT STORAGE - ${dirPath} - ${err.message}`);
        return err;
      })
    ).toPromise();
  }

  /************************************************************************************ PRIVATE FUNCTIONS ************************************************************************************/

  private async _connection() {
    const body = {
      auth: {
        identity: {
          methods: [
            "password"
          ],
          password: {
            user: {
              name: this._config.username,
              domain: {
                name: "default"
              },
              password: this._config.password
            }
          }
        },
        scope: {
          project: {
            name: this._config.tenantId,
            domain: {id: "default"}
          }
        }
      }
    };
    await this._http.post(`${this._config.authURL}/auth/tokens`, body).toPromise().then(async res => {
      this._token = res.headers['x-subject-token'];
      const serviceCatalog = res.data.token.catalog.find(c => c.type === 'object-store');
      this._endpoint = `${serviceCatalog.endpoints.find(e => e.region === this._config.region).url}/${this._config.container}`;
      console.log(`${new Date().toLocaleString()} - CONNECTED TO OVH OBJECT STORAGE V3`);
    }, err => {
      console.error(`${new Date().toLocaleString()} - FAILED TO CONNECT TO OVH OBJECT STORAGE - `, err.message);
    });
  }

  private _setHeaders() {
    return {
      headers: {
        'X-Auth-Token': this._token
      }
    }
  }
}
