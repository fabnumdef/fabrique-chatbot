import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ChatbotGenerationService } from "../chatbot/chatbot-generation.service";
import { ChatbotService } from "../chatbot/chatbot.service";
import { Chatbot } from "@entity/chatbot.entity";
import { HttpService } from "@nestjs/common";
import { LaunchUpdateChatbotDto } from "@dto/launch-update-chatbot.dto";

@Processor('admin_update')
export class AdminProcessor {

  constructor(private readonly _chatbotGenerationService: ChatbotGenerationService,
              private readonly _chatbotService: ChatbotService,
              private readonly _http: HttpService) {
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
    try {
      console.log(job.data);
      await this._http.post(
        `${host_url}/api/update`,
        {
          ...updateChatbot, ...{
            frontBranch: chatbot.front_branch,
            backBranch: chatbot.back_branch,
            botBranch: chatbot.bot_branch
          }
        },
        {headers}).toPromise().then();
      console.log('Update Chatbot completed');
    } catch (err) {
      console.error(err);
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
