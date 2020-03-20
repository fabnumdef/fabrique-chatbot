import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService]
})
export class ChatbotModule {}
