import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chatbot } from "@entity/chatbot.entity";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Chatbot]),
    SharedModule
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService]
})
export class ChatbotModule {}
