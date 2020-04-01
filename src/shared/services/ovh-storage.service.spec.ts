import { Test, TestingModule } from '@nestjs/testing';
import { OvhStorageService } from './ovh-storage.service';
import { HttpModule, HttpService } from "@nestjs/common";
import { of, throwError } from "rxjs";
import Spy = jasmine.Spy;

describe('OvhStorageService', () => {
  let ovhStorageService: OvhStorageService;
  let httpService: HttpService;
  let spyHttp: Spy;
  const responseBody = {
    data: {
      access: {
        token: {id: 'token'},
        serviceCatalog: [
          {
            type: 'object-store',
            endpoints: [
              {
                region: 'paris',
                publicURL: 'https://gotham.fr'
              }
            ]
          }
        ]
      }
    }
  };

  beforeEach(async () => {
    process.env.OBJECT_STORAGE_USER = 'batman@gotham.fr';
    process.env.OBJECT_STORAGE_PASSWORD = 'WayneCorp';
    process.env.OBJECT_STORAGE_ID = 'BATMAN';
    process.env.OBJECT_STORAGE_REGION = 'paris';
    process.env.OBJECT_STORAGE_CONTAINER_NAME = 'GADGETS';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        OvhStorageService
      ],
    }).compile();

    ovhStorageService = module.get<OvhStorageService>(OvhStorageService);
    httpService = module.get<HttpService>(HttpService);

    spyHttp = spyOn(httpService, 'post').and.returnValue(of(responseBody));
    spyHttp.calls.reset();
  });

  it('should be defined', () => {
    expect(ovhStorageService).toBeDefined();
  });

  describe('Connection', () => {
    it('should call http connection on connection with the rights values', async () => {
      await jest.resetModules();
      // @ts-ignore
      await ovhStorageService._connection();

      expect(httpService.post).toHaveBeenCalled();
      // @ts-ignore
      expect(ovhStorageService._token).toEqual({id: 'token'});
      // @ts-ignore
      expect(ovhStorageService._endpoint).toEqual('https://gotham.fr/GADGETS');
    });

    it('should log connection to object server', async () => {
      jest.spyOn(console, 'log');
      await jest.resetModules();
      // @ts-ignore
      await ovhStorageService._connection();

      expect(console.log).toHaveBeenCalled();
    });

    it('should log error if connection crash', async () => {
      spyHttp.and.callFake(() => {
        return throwError(new Error('FAILED'));
      });
      jest.spyOn(console, 'error');
      await jest.resetModules();
      // @ts-ignore
      await ovhStorageService._connection();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('List', () => {
    beforeEach(async () => {
      await jest.resetModules();
      // @ts-ignore
      await ovhStorageService._connection();
    });

    it('should call http connection on list with the rights values', async () => {
      const spyGet = spyOn(httpService, 'get').and.returnValue(of(true));
      await ovhStorageService.list().then();

      // @ts-ignore
      expect(httpService.get).toHaveBeenCalledWith('https://gotham.fr/GADGETS', ovhStorageService._setHeaders());

      spyGet.calls.reset();
      await ovhStorageService.list('1').then();

      // @ts-ignore
      expect(httpService.get).toHaveBeenCalledWith('https://gotham.fr/GADGETS?prefix=1', ovhStorageService._setHeaders());
    });

    it('should log connection when http call', async () => {
      spyOn(httpService, 'get').and.returnValue(of(true));
      jest.spyOn(console, 'log');
      await ovhStorageService.list().then();

      expect(console.log).toHaveBeenCalled();
    });

    it('should log error if http call crash', async () => {
      spyOn(httpService, 'get').and.callFake(() => {
        return throwError(new Error('FAILED'));
      });
      jest.spyOn(console, 'error');

      expect(ovhStorageService.list().then()).rejects.toBeTruthy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Get', () => {
    beforeEach(async () => {
      await jest.resetModules();
      // @ts-ignore
      await ovhStorageService._connection();
    });

    it('should call http connection on get with the rights values', async () => {
      spyOn(httpService, 'get').and.returnValue(of(true));
      await ovhStorageService.get('batmobile.png').then();

      // @ts-ignore
      expect(httpService.get).toHaveBeenCalledWith('https://gotham.fr/GADGETS/batmobile.png', ovhStorageService._setHeaders());
    });

    it('should log connection when http call', async () => {
      spyOn(httpService, 'get').and.returnValue(of(true));
      jest.spyOn(console, 'log');
      await ovhStorageService.get('batmobile.png').then();

      expect(console.log).toHaveBeenCalled();
    });

    it('should log error if http call crash', async () => {
      spyOn(httpService, 'get').and.callFake(() => {
        return throwError(new Error('FAILED'));
      });
      jest.spyOn(console, 'error');

      expect(ovhStorageService.get('batmobile.png').then()).rejects.toBeTruthy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Set', () => {
    beforeEach(async () => {
      await jest.resetModules();
      // @ts-ignore
      await ovhStorageService._connection();
    });

    it('should call http connection on list with the rights values', async () => {
      spyOn(httpService, 'put').and.returnValue(of(true));
      await ovhStorageService.set({}, 'batmobile.png').then();

      // @ts-ignore
      expect(httpService.put).toHaveBeenCalledWith('https://gotham.fr/GADGETS/batmobile.png', {}, ovhStorageService._setHeaders());
    });

    it('should log connection when http call', async () => {
      spyOn(httpService, 'put').and.returnValue(of(true));
      jest.spyOn(console, 'log');
      await ovhStorageService.set({}, 'batmobile.png').then();

      expect(console.log).toHaveBeenCalled();
    });

    it('should log error if http call crash', async () => {
      spyOn(httpService, 'put').and.callFake(() => {
        return throwError(new Error('FAILED'));
      });
      jest.spyOn(console, 'error');

      expect(ovhStorageService.set({}, 'batmobile.png').then()).rejects.toBeTruthy();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
