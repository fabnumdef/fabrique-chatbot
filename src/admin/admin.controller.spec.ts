import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { User } from "@entity/user.entity";
import { usersMock } from "@mock/users.mock";
import cloneDeep = require('lodash/cloneDeep');
import { Chatbot } from "@entity/chatbot.entity";
import { chatbotsMock } from "@mock/chatbots.mock";

describe('Admin Controller', () => {

  const users: User[] = cloneDeep(usersMock);
  const chatbots: Chatbot[] = cloneDeep(chatbotsMock);

  let adminController: AdminController;

  let userServiceStub = {
    findAll: () => users,
  };
  let chatbotServiceStub = {
    findAll: () => chatbots,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {provide: 'UserService', useValue: userServiceStub},
        {provide: 'ChatbotService', useValue: chatbotServiceStub},
      ]
    }).compile();

    adminController = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(adminController).toBeDefined();
  });

  it('should get all chatbots', async () => {
    const allChatbots = await adminController.getChatbots();
    expect(allChatbots.length).toEqual(1);
  });

  it('should get all users', async () => {
    const allUsers = await adminController.getUsers();
    expect(allUsers.length).toEqual(1);
  });
});
