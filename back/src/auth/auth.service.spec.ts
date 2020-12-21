import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from "../user/user.service";
import cloneDeep = require('lodash/cloneDeep');
import { User } from "@entity/user.entity";
import { usersMock } from "@mock/users.mock";
import { MailService } from "../shared/services/mail.service";
import { mailServiceStub } from "../../test/stubs/mail.service.stub";

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let mailService: MailService;
  let jwtServiceStub = {
    sign: (data) => data
  };
  let userServiceStub = {
    findOne: () => new Promise<any>(() => {
    }),
    setPasswordResetToken: (user) => new Promise<any>(() => {
    }),
    findOneWithParam: (params) => new Promise<any>(() => {
    }),
    findAndUpdate: (email, params) => new Promise<any>(() => {
    }),
  };

  const users: User[] = cloneDeep(usersMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {provide: 'MailService', useValue: mailServiceStub},
        {provide: 'JwtService', useValue: jwtServiceStub},
        {provide: 'UserService', useValue: userServiceStub}
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Login', () => {
    it('should throw exception if there is no user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      await expect(authService.login({email: 'batman@gotham.fr', password: 'WayneCorp'})).rejects.toBeTruthy();
      expect(userService.findOne).toHaveBeenCalled();
    });

    it('should throw exception if passwords are not the same', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(users[0]);

      await expect(authService.login({email: 'batman@gotham.fr', password: 'WayneCorpBis'})).rejects.toBeTruthy();
      expect(userService.findOne).toHaveBeenCalled();
    });

    it('should return token if there is a user with same password', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(users[0]);

      expect((await authService.login({
        email: 'batman@gotham.fr',
        password: 'WayneCorp'
      })).chatbotFactoryToken).toBeDefined();
      expect(userService.findOne).toHaveBeenCalled();
    });
  });

  describe('Password Forgot', () => {
    it('should return null if there is no user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(mailService, 'sendEmail').mockResolvedValueOnce(null);

      expect((await authService.sendEmailPasswordToken('batman@gotham.fr'))).toEqual(undefined);
      expect(mailService.sendEmail).not.toHaveBeenCalled();
    });

    it('should send mail if there is an user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(users[0]);
      jest.spyOn(mailService, 'sendEmail').mockResolvedValueOnce(null);
      jest.spyOn(userService, 'setPasswordResetToken').mockResolvedValueOnce(users[0]);

      await authService.sendEmailPasswordToken('batman@gotham.fr');
      expect(userService.setPasswordResetToken).toHaveBeenCalled();
      expect(mailService.sendEmail).toHaveBeenCalled();
    });
  });

  describe('Password Reset', () => {
    it('should throw exception if there is no user', async () => {
      jest.spyOn(userService, 'findOneWithParam').mockResolvedValueOnce(null);
      jest.spyOn(mailService, 'sendEmail').mockResolvedValueOnce(null);

      await expect(authService.resetPassword({password: 'WayneCorp', token: 'token'})).rejects.toBeTruthy();
      expect(userService.findOneWithParam).toHaveBeenCalled();
      expect(mailService.sendEmail).toHaveBeenCalled();
    });

    it('should hash password, save it and send email', async () => {
      jest.spyOn(userService, 'findOneWithParam').mockResolvedValueOnce(users[0]);
      jest.spyOn(userService, 'findAndUpdate').mockResolvedValueOnce(users[0]);
      jest.spyOn(mailService, 'sendEmail').mockResolvedValueOnce(null);

      await authService.resetPassword({password: 'WayneCorp', token: 'token'});
      expect(userService.findOneWithParam).toHaveBeenCalled();
      expect(userService.findAndUpdate).toHaveBeenCalled();
      expect(mailService.sendEmail).toHaveBeenCalled();
    });
  });
});
