import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chatbot } from "@entity/chatbot.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Chatbot])],
  controllers: [ChatbotController],
  providers: [ChatbotService]
})
export class ChatbotModule {}
