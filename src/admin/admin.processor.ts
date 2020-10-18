import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { ChatbotGenerationService } from "../chatbot/chatbot-generation.service";
import { ChatbotService } from "../chatbot/chatbot.service";
import { Chatbot } from "@entity/chatbot.entity";
import { HttpService } from "@nestjs/common";
import { LaunchUpdateChatbotDto } from "@dto/launch-update-chatbot.dto";

@Processor('chatbot_update')
export class AdminProcessor {

  constructor(private readonly _chatbotGenerationService: ChatbotGenerationService,
              private readonly _chatbotService: ChatbotService,
              private readonly _http: HttpService,
              @InjectQueue('chatbot_update') private readonly _chatbotUpdateQueue: Queue) {
  }

  @Process('update')
  async updateChatbot(job: Job) {
    console.log('Update Chatbot...');

    const chatbot: Chatbot = job.data.chatbot;
    const updateChatbot: LaunchUpdateChatbotDto = job.data.updateChatbot;
    const host_url = chatbot.domain_name ? `https://${chatbot.domain_name}` : `http://${chatbot.ip_adress}`;

    let headers: any = {
      'x-api-key': chatbot.api_key
    };
    let isTraining;
    await this._http.get(`${host_url}/api/config/training`, {headers}).toPromise().then(response => {
      isTraining = response.data;
    }).catch(err => {
      console.error(err);
      isTraining = true;
    });
    if (isTraining && (updateChatbot.updateBack || updateChatbot.updateRasa)) {
      console.log('Update Chatbot aborting, chatbot is training');
      await job.retry();
      return;
    }
    try {
      console.log(job.data);
      await this._http.put(`${host_url}/api/config/block`, {isBlocked: true}, {headers}).toPromise().then();
      await this._chatbotGenerationService.updateChatbot(job.data.chatbot, job.data.updateChatbot);
      await this._http.put(`${host_url}/api/config/block`, {isBlocked: false}, {headers}).toPromise().then();
      console.log('Update Chatbot completed');
    } catch (err) {
      await job.retry();
      console.error('Update Chatbot failed');
    }
  }

  @Process('update_status')
  async updateStatusChatbot(job: Job) {
    console.log('Update Chatbot Status ...');
    console.log(job.data);
    await this._chatbotService.update(job.data.chatbotId, job.data.updateChatbot);
    console.log('Update Chatbot Status completed');
  }
}
