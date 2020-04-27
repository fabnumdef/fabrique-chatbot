import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { User } from "@entity/user.entity";
import { usersMock } from "@mock/users.mock";
import cloneDeep = require('lodash/cloneDeep');
import { CreateUserDto } from "@dto/create-user.dto";
import camelcaseKeys = require("camelcase-keys");
import { UserDto } from "@dto/user.dto";
import { plainToClass } from "class-transformer";
import { UpdateUserDto } from "@dto/update-user.dto";
import { UserRole } from "@enum/user-role.enum";
import { UserService } from "./user.service";

describe('User Controller', () => {

  const users: User[] = cloneDeep(usersMock);

  let userController: UserController;
  let userService: UserService;
  let userServiceStub = {
    create: (user) => users[0],
    delete: (email) => true,
    findAndUpdate: (email: string, data: any) => users[0]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {provide: 'UserService', useValue: userServiceStub},
      ]
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should create user', async () => {
    const userCreated = await userController.create(<CreateUserDto> {});
    expect(userCreated).toEqual(plainToClass(UserDto, camelcaseKeys(users[0], {deep: true})));
  });

  describe('on update user', () => {
    it('should return error if the user is not admin and the user updated is not current user', async () => {
      const userUpdateRequest = userController.update('bruce@gotham.fr', new UpdateUserDto(), {user: {role: UserRole.user, email: 'gordon@gotham.fr'}});
      await expect(userUpdateRequest).rejects.toBeTruthy();
    });

    it('should delete role update if the user is not admin', async () => {
      jest.spyOn(userService, 'findAndUpdate').mockResolvedValue(users[0]);
      await userController.update('gordon@gotham.fr', <UpdateUserDto> {role: UserRole.admin, firstName: 'Gordon'}, {user: {role: UserRole.user, email: 'gordon@gotham.fr'}});
      expect(userService.findAndUpdate).toHaveBeenCalledWith('gordon@gotham.fr', {first_name: 'Gordon'});
    });

    it('should keep role update if the user is admin', async () => {
      jest.spyOn(userService, 'findAndUpdate').mockResolvedValue(users[0]);
      await userController.update('gordon@gotham.fr', <UpdateUserDto> {role: UserRole.admin, firstName: 'Gordon'}, {user: {role: UserRole.admin, email: 'gordon@gotham.fr'}});
      expect(userService.findAndUpdate).toHaveBeenCalledWith('gordon@gotham.fr', {first_name: 'Gordon', role: UserRole.admin});
    });
  })
});
