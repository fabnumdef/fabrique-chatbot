import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MailService } from "../shared/services/mail.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@entity/user.entity";
import cloneDeep = require('lodash/cloneDeep');
import { usersMock } from "@mock/users.mock";

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let mailService: MailService;
  let mailServiceStub = {
    sendEmail: (options: any) => new Promise<any>(() => {
    })
  };

  const users: User[] = cloneDeep(usersMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {provide: 'MailService', useValue: mailServiceStub},
        {provide: getRepositoryToken(User), useClass: Repository}
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    mailService = module.get<MailService>(MailService);
  });

  beforeEach(() => {
    // RESET USER VALUES
    users[0].reset_password_token = null;
    users[0].reset_password_expires = null;
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('repository calls', () => {
    it('should call find when findAll', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);
      expect(await userService.findAll()).toEqual(users);
    });

    it('should call findOne with no password', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(users[0]);
      userService.findOne(users[0].email);
      expect(userRepository.findOne).toHaveBeenCalledWith({where: {email: users[0].email}});
    });

    it('should call findOne with password', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(users[0]);
      userService.findOne(users[0].email, true);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        select: ['email', 'password', 'first_name', 'last_name', 'chatbot_theme', 'role'],
        where: {email: users[0].email}
      });
    });

    it('should call findOne with params', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(users[0]);
      userService.findOneWithParam(users[0].email);
      expect(userRepository.findOne).toHaveBeenCalledWith(users[0].email);
    });

    it('should call save and update if the user exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(users[0]);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(users[0]);

      await userService.findAndUpdate(users[0].email, {first_name: 'Robin'});
      expect(userRepository.findOne).toHaveBeenCalled();
      const userUpdated = cloneDeep(users[0]);
      userUpdated.first_name = 'Robin';
      expect(userRepository.save).toHaveBeenCalledWith(userUpdated);
    });

    it('should throw an error on save and update if the user doest not exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(users[0]);

      await expect(userService.findAndUpdate(users[0].email, {first_name: 'Robin'})).rejects.toBeTruthy();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should call delete', async () => {
      jest.spyOn(userRepository, 'delete').mockResolvedValueOnce({raw: ''});
      userService.delete(users[0].email);
      expect(userRepository.delete).toHaveBeenCalledWith(users[0].email);
    });
  });

  describe('create user', () => {
    it('should create user if it does not exists and send email', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(users[0]);
      jest.spyOn(userService, 'sendEmailPasswordToken').mockResolvedValueOnce(null);

      await userService.create(users[0]);
      expect(userRepository.save).toHaveBeenCalledWith(users[0]);
    });

    it('should not create user if it already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(users[0]);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(users[0]);

      await expect(userService.create(users[0])).rejects.toBeTruthy();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should send mail and generate token when user is created', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(users[0]);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(users[0]);
      jest.spyOn(mailService, 'sendEmail').mockResolvedValueOnce(true);

      await userService.sendEmailPasswordToken(users[0]);
      expect(userRepository.save).toHaveBeenCalled();
      expect(mailService.sendEmail).toHaveBeenCalled();
    });
  });
});
