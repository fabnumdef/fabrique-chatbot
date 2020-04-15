import { HttpModule, Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chatbot } from "@entity/chatbot.entity";
import { SharedModule } from "../shared/shared.module";
import { ChatbotGenerationService } from './chatbot-generation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chatbot]),
    SharedModule,
    HttpModule
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotGenerationService],
  exports: [ChatbotService, ChatbotGenerationService]
})
export class ChatbotModule {}
