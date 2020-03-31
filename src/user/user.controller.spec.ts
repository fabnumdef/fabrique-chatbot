import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { User } from "@entity/user.entity";
import { usersMock } from "@mock/users.mock";
import cloneDeep = require('lodash/cloneDeep');
import { CreateUserDto } from "@dto/create-user.dto";
import camelcaseKeys = require("camelcase-keys");
import { UserDto } from "@dto/user.dto";
import { plainToClass } from "class-transformer";

describe('User Controller', () => {

  const users: User[] = cloneDeep(usersMock);

  let userController: UserController;
  let userServiceStub = {
    findAll: () => users,
    create: (user) => users[0],
    delete: (email) => true
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {provide: 'UserService', useValue: userServiceStub},
      ]
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should get all users', async () => {
    const allUsers = await userController.getUsers();
    expect(allUsers.length).toEqual(1);
  });

  it('should create user', async () => {
    const userCreated = await userController.create(<CreateUserDto> {});
    expect(userCreated).toEqual(plainToClass(UserDto, camelcaseKeys(users[0], {deep: true})));
  });

  it('should delete user', async () => {
    expect(await userController.delete(users[0].email)).toEqual(true);
  });
});
