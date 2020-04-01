import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotController } from './chatbot.controller';
import { Chatbot } from "@entity/chatbot.entity";
import cloneDeep = require('lodash/cloneDeep');
import { chatbotsMock } from "@mock/chatbots.mock";
import { CreateChatbotDto } from "@dto/create-chatbot.dto";
import { ChatbotService } from "./chatbot.service";

describe('Chatbot Controller', () => {

  const chatbots: Chatbot[] = cloneDeep(chatbotsMock);

  let chatbotController: ChatbotController;
  let chatbotService: ChatbotService;

  let chatbotServiceStub = {
    checkTemplateFile: () => { return {questionsNumber: 8, errors: {}} },
    create: () => chatbots[0]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotController],
      providers: [
        {provide: 'ChatbotService', useValue: chatbotServiceStub},
      ]
    }).compile();

    chatbotController = module.get<ChatbotController>(ChatbotController);
    chatbotService = module.get<ChatbotService>(ChatbotService);
  });

  it('should be defined', () => {
    expect(chatbotController).toBeDefined();
  });

  it('should get check template with uploaded file', async () => {
    const resume = await chatbotController.checkTemplateFile({});
    expect(resume.questionsNumber).toEqual(8);
  });

  it('should create chatbot if there is no error in template file', async () => {
    jest.spyOn(chatbotService, 'create');

    await chatbotController.create({file: [], icon: []}, <CreateChatbotDto> {});
    expect(chatbotService.create).toHaveBeenCalled();
  });

  it('should not create chatbot if there is errors in template file', async () => {
    jest.spyOn(chatbotService, 'checkTemplateFile').mockReturnValue({questionsNumber: 8, errors: {'1': 'fail'}, categories: [], warnings: {}});

    await expect(chatbotController.create({file: [], icon: []},  <CreateChatbotDto> {})).rejects.toBeTruthy();
  });
});
