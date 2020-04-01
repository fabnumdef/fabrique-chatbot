import { Injectable } from '@nestjs/common';
import { Cron } from "@nestjs/schedule";
import { ChatbotService } from "./chatbot.service";
import { BotStatus } from "@enum/bot-status.enum";

@Injectable()
export class ChatbotGenerationService {
  constructor(private readonly _chatbotService: ChatbotService) {
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  @Cron('*/30 * * * * *')
  async checkChatbots() {
    const botToBeCreated = await this._chatbotService.findAll({
      status: BotStatus.pending
    });
    if(!botToBeCreated || botToBeCreated.length < 1) {
      return;
    }
    // console.log('Chatbots waiting for creation', botToBeCreated.length);
  }
}
