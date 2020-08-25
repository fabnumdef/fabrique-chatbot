import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ChatbotGenerationService } from "../chatbot/chatbot-generation.service";
import { ChatbotService } from "../chatbot/chatbot.service";

@Processor('chatbot_update')
export class AdminProcessor {

  constructor(private readonly _chatbotGenerationService: ChatbotGenerationService,
              private readonly _chatbotService: ChatbotService,) {
  }

  @Process('update')
  updateChatbot(job: Job) {
    console.log('Update Chatbot...');
    console.log(job.data);
    this._chatbotGenerationService.updateChatbot(job.data.chatbot, job.data.updateChatbot);
    console.log('Update Chatbot completed');
  }

  @Process('update_status')
  updateStatusChatbot(job: Job) {
    console.log('Update Chatbot Status ...');
    console.log(job.data);
    this._chatbotService.update(job.data.chatbotId, job.data.updateChatbot);
    console.log('Update Chatbot Status completed');
  }
}
