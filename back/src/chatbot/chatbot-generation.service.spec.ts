import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotGenerationService } from './chatbot-generation.service';
import { ChatbotService } from "./chatbot.service";
import { OvhStorageService } from "../shared/services/ovh-storage.service";
import { ovhStorageServiceStub } from "../../test/stubs/ovh-storage.service.stub";
import { HttpModule } from "@nestjs/common";
import { mailServiceStub } from "../../test/stubs/mail.service.stub";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Chatbot } from "@entity/chatbot.entity";
import { Repository } from "typeorm";

describe('ChatbotGenerationService', () => {
  let service: ChatbotGenerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        ChatbotGenerationService,
        ChatbotService,
        {provide: getRepositoryToken(Chatbot), useClass: Repository},
        {provide: OvhStorageService, useValue: ovhStorageServiceStub},
        {provide: 'MailService', useValue: mailServiceStub},
      ],
    }).compile();

    service = module.get<ChatbotGenerationService>(ChatbotGenerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
