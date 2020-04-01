import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotGenerationService } from './chatbot-generation.service';

describe('ChatbotGenerationService', () => {
  let service: ChatbotGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatbotGenerationService],
    }).compile();

    service = module.get<ChatbotGenerationService>(ChatbotGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
