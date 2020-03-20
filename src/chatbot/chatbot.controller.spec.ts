import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotController } from './chatbot.controller';

describe('Chatbot Controller', () => {
  let controller: ChatbotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotController],
    }).compile();

    controller = module.get<ChatbotController>(ChatbotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
