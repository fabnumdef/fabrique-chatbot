import { HttpModule, Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chatbot } from "@entity/chatbot.entity";
import { SharedModule } from "../shared/shared.module";
import { ChatbotGenerationService } from './chatbot-generation.service';
import { BullModule } from "@nestjs/bull";
import { ChatbotProcessor } from "./chatbot.processor";

@Module({
  imports: [
    TypeOrmModule.forFeature([Chatbot]),
    SharedModule,
    HttpModule,
    BullModule.registerQueue({
      name: 'chatbot_update'
    }),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotGenerationService, ChatbotProcessor],
  exports: [ChatbotService, ChatbotGenerationService]
})
export class ChatbotModule {}
