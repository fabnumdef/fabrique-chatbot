import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ChatbotGenerationService } from "../chatbot/chatbot-generation.service";
import { ChatbotService } from "../chatbot/chatbot.service";
import { Chatbot } from "@entity/chatbot.entity";
import { HttpService } from "@nestjs/common";
import { LaunchUpdateChatbotDto } from "@dto/launch-update-chatbot.dto";
import * as fs from "fs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FabriqueConfig } from "@entity/config.entity";
import { UpdateChatbotDto } from "@dto/update-chatbot.dto";
import { BotLogger } from "../logger/bot.logger";

const FormData = require('form-data');

@Processor('admin_update')
export class AdminProcessor {

  private _appDir = '/var/www/fabrique-chatbot-back/ansible';
  private readonly _logger = new BotLogger('AdminProcessor');

  constructor(private readonly _chatbotGenerationService: ChatbotGenerationService,
              private readonly _chatbotService: ChatbotService,
              private readonly _http: HttpService,
              @InjectRepository(FabriqueConfig) private readonly _fabriqueConfigRepository: Repository<FabriqueConfig>) {
  }

  @Process('update')
  async updateChatbot(job: Job) {
    this._logger.log('Update Chatbot...', job.data.chatbot.id);

    const chatbot: Chatbot = job.data.chatbot;
    const fabriqueConfig: FabriqueConfig = await this._fabriqueConfigRepository.findOne(1);
    const updateChatbot: LaunchUpdateChatbotDto = job.data.updateChatbot;
    const host_url = chatbot.domain_name ? `https://${chatbot.domain_name}` : `http://${chatbot.ip_adress}`;

    try {
      const updateForm = new FormData();
      updateForm.append('updateFront', updateChatbot.updateFront.toString());
      updateForm.append('updateBack', updateChatbot.updateBack.toString());
      updateForm.append('updateRasa', updateChatbot.updateRasa.toString());
      updateForm.append('updateLogs', updateChatbot.updateLogs.toString());
      updateForm.append('frontBranch', chatbot.front_branch);
      updateForm.append('backBranch', chatbot.back_branch);
      updateForm.append('botBranch', chatbot.bot_branch);
      updateForm.append('domainName', chatbot.domain_name);
      updateForm.append('nginx_conf', fs.createReadStream(`${this._appDir}/chatbot/nginx.conf`));
      updateForm.append('nginx_site', fs.createReadStream(`${this._appDir}/chatbot/nginx_conf.cfg`));
      if(fabriqueConfig) {
        updateForm.append('elastic_host', fabriqueConfig.elastic_host);
        updateForm.append('elastic_username', fabriqueConfig.elastic_username);
        updateForm.append('elastic_password', fabriqueConfig.elastic_password);
        updateForm.append('elastic_metricbeat_index', fabriqueConfig.elastic_metricbeat_index);
        updateForm.append('elastic_packetbeat_index', fabriqueConfig.elastic_packetbeat_index);
        updateForm.append('elastic_filebeat_index', fabriqueConfig.elastic_filebeat_index);
      }
      const headers = {
        ...updateForm.getHeaders(),
        ...{'x-api-key': chatbot.api_key},
      };
      await this._http.post(
        `${host_url}/api/update`,
        updateForm,
        {headers: headers}
      ).toPromise().then();
      this._logger.log('Update Chatbot completed', job.data.chatbot.id);
    } catch (err) {
      this._logger.error('Update Chatbot failed', err);
      await job.retry();
    }
  }

  @Process('update_status')
  async updateStatusChatbot(job: Job) {
    this._logger.log('Update Chatbot Status ...', job.data.chatbotId);
    await this._chatbotService.update(job.data.chatbotId, job.data.updateChatbot);
    this._logger.log('Update Chatbot Status completed', job.data.chatbotId);
  }

  @Process('update_domain_name')
  async updateDomainNameChatbot(job: Job) {
    this._logger.log('Update Chatbot Domain Name ...', job.data.chatbot?.id);

    const chatbot: Chatbot = job.data.chatbot;
    const updateChatbot: UpdateChatbotDto = job.data.updateChatbot;

    const host_url = chatbot.domain_name ? `https://${chatbot.domain_name}` : `http://${chatbot.ip_adress}`;
    const headers = {
      'x-api-key': chatbot.api_key
    };
    try {
      await this._http.post(
        `${host_url}/api/config/domain-name`,
        updateChatbot,
        {headers: headers}
      ).toPromise().then();
      await this._chatbotService.findAndUpdate(chatbot.id, {domain_name: updateChatbot.domainName})
      this._logger.log('Update Chatbot Domain Name completed', job.data.chatbot?.id);
    } catch (err) {
      this._logger.error('Update Chatbot Domain Name failed', err);
      await job.retry();
    }
  }
}
