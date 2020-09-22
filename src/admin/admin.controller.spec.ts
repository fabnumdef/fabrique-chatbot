import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { User } from "@entity/user.entity";
import { usersMock } from "@mock/users.mock";
import cloneDeep = require('lodash/cloneDeep');
import { Chatbot } from "@entity/chatbot.entity";
import { chatbotsMock } from "@mock/chatbots.mock";
import { UpdateChatbotDto } from "@dto/update-chatbot.dto";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { LaunchUpdateChatbotDto } from "@dto/launch-update-chatbot.dto";

describe('Admin Controller', () => {

  const users: User[] = cloneDeep(usersMock);
  const chatbots: Chatbot[] = cloneDeep(chatbotsMock);

  let adminController: AdminController;

  let userServiceStub = {
    findAll: () => users,
    deleteUser: (email: string) => {
    }
  };
  let chatbotServiceStub = {
    findAll: () => chatbots,
    delete: (id: number) => {
    },
    update: (id: number, updateChatbot: UpdateChatbotDto) => {
    },
    findOneWithParam: (id: number, status: ChatbotStatus): Chatbot => {
      return null;
    }
  };
  let chatbotGenerationServiceStub = {
    updateChatbotRepos: () => {
    },
    updateChatbot: () => {
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {provide: 'UserService', useValue: userServiceStub},
        {provide: 'ChatbotService', useValue: chatbotServiceStub},
        {provide: 'ChatbotGenerationService', useValue: chatbotGenerationServiceStub},
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
    expect(allUsers.length).toEqual(2);
  });

  it('should call delete user', async () => {
    spyOn(userServiceStub, 'deleteUser');
    await adminController.deleteUser('bruce@wayne.fr');
    expect(userServiceStub.deleteUser).toHaveBeenCalledWith('bruce@wayne.fr');
  });

  it('should call delete chatbot', async () => {
    spyOn(chatbotServiceStub, 'delete');
    await adminController.deleteChatbot(2);
    expect(chatbotServiceStub.delete).toHaveBeenCalledWith(2);
  });

  it('should call update chatbot', async () => {
    spyOn(chatbotServiceStub, 'update');
    await adminController.update(2, <UpdateChatbotDto>{name: 'Bruce'});
    expect(chatbotServiceStub.update).toHaveBeenCalledWith(2, {name: 'Bruce'});
  });

  describe('on launch update chatbot', () => {

    it('should throw error if there is no chatbot running', async () => {
      jest.spyOn(chatbotServiceStub, 'findOneWithParam').mockReturnValue(null);
      await expect(adminController.updateChatbot(2, new LaunchUpdateChatbotDto())).rejects.toBeTruthy();
    });

    it('should call update repos & update chatbot', async () => {
      spyOn(chatbotGenerationServiceStub, 'updateChatbotRepos');
      spyOn(chatbotGenerationServiceStub, 'updateChatbot');
      jest.spyOn(chatbotServiceStub, 'findOneWithParam').mockReturnValue(chatbots[0]);
      await adminController.updateChatbot(2, new LaunchUpdateChatbotDto(true, true, false));
      expect(chatbotGenerationServiceStub.updateChatbotRepos).toHaveBeenCalled();
      expect(chatbotGenerationServiceStub.updateChatbot).toHaveBeenCalledWith(chatbots[0], {updateFront: true, updateBack: true, updateRasa: false});
    });

  })
});
