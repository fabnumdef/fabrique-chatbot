import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { ChatbotService } from "./chatbot.service";
import { HttpService } from "@nestjs/common";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { ChatbotGenerationService } from "./chatbot-generation.service";

@Processor('chatbot_update')
export class ChatbotProcessor {

  constructor(private readonly _chatbotService: ChatbotService,
              private readonly _chatbotGenerationService: ChatbotGenerationService,
              private readonly _http: HttpService,
              @InjectQueue('chatbot_update') private readonly _chatbotUpdateQueue: Queue) {
  }

  @Process('pending_configuration')
  async updatePendingConfiguration(job: Job) {
    console.log('Update Pending Configuration ...', job.data.chatbot.id);
    // console.log(job.data);
    await this._chatbotService.generateChatbot(job.data.chatbot, job.data.updateChatbot);
    await this._chatbotService.findAndUpdate(job.data.chatbot.id, {
      status: ChatbotStatus.pending_configuration,
      ip_adress: job.data.updateChatbot.ipAdress
    });
    await this._chatbotUpdateQueue.add('configuration', job.data);
    console.log('Update Pending Configuration completed', job.data.chatbot.id);
  }

  @Process('configuration')
  async updateConfiguration(job: Job) {
    console.log('Update Configuration ...', job.data.chatbot.id);
    // console.log(job.data);
    await this._chatbotService.findAndUpdate(job.data.chatbot.id, {status: ChatbotStatus.configuration});
    console.log(`${new Date().toLocaleString()} - GENERATING CHATBOT - ${job.data.chatbot.id} - ${job.data.chatbot.name}`);
    await this._chatbotGenerationService.updateChatbot(job.data.chatbot, job.data.updateChatbot);
    try {
      await this._chatbotGenerationService.initChatbot(job.data.chatbot);
    } catch (err) {
      console.error(`${new Date().toLocaleString()} - ERROR INITIATING BOT - ${job.data.chatbot.id} - ${err.message}`);
    }
    console.log('Update Configuration completed', job.data.chatbot.id);
  }
}
