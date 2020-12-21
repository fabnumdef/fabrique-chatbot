import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service";

describe('Auth Controller', () => {
  let authController: AuthController;
  let authService: AuthService;

  let authServiceStub = {
    sendEmailPasswordToken: () => {},
    resetPassword: () => {},
    login: () => {return {}}
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {provide: 'AuthService', useValue: authServiceStub},
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should send email password token', async () => {
    jest.spyOn(authService, 'sendEmailPasswordToken');
    await authController.forgotPassword('');
    expect(authService.sendEmailPasswordToken).toHaveBeenCalled();
  });

  it('should reset password', async () => {
    jest.spyOn(authService, 'resetPassword');
    await authController.resetPassword({password: '', token: ''});
    expect(authService.resetPassword).toHaveBeenCalled();
  });

  it('should login', async () => {
    jest.spyOn(authService, 'login');
    await authController.login({email: '', password: ''});
    expect(authService.login).toHaveBeenCalled();
  });
});
