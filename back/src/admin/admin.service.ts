import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AnsiblePlaybook, Options } from "ansible-playbook-cli-js";
import { BotLogger } from "../logger/bot.logger";
import { Chatbot } from "@entity/chatbot.entity";
import { UpdateChatbotDto } from "@dto/update-chatbot.dto";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { ChatbotService } from "../chatbot/chatbot.service";
import { LaunchUpdateChatbotDto } from "@dto/launch-update-chatbot.dto";
import * as FormData from 'form-data';
import * as fs from "fs";

@Injectable()
export class AdminService {

  private _gitDir = '/var/www/git/fabrique-chatbot/ansible';
  private readonly _logger = new BotLogger('AdminService');

  constructor(private readonly _chatbotService: ChatbotService,
              private readonly _http: HttpService) {
  }

  async generateIntranetPackage(): Promise<void> {
    const appDir = '/var/www/fabrique-chatbot-back';
    const playbookOptions = new Options(`${appDir}/ansible`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    const extraVars = {
      frontBranch: 'master',
      backBranch: 'master',
      botBranch: 'master'
    };
    await ansiblePlaybook.command(`playUsineupdaterepos.yml --vault-id dev@password_file -e '${JSON.stringify(extraVars)}'`).then((result) => {
      this._logger.log(`UPDATING CHATBOTS REPOSITORIES`);
      this._logger.log(result);
    }).catch(err => {
      this._logger.error(`ERRROR UPDATING CHATBOTS REPOSITORIES`, err);
    });
    await ansiblePlaybook.command(`playUsinegenerateintranet.yml --vault-id dev@password_file`).then(result => {
      this._logger.log(`GENERATING INTRANET PACKAGE`);
      this._logger.log(result)
    }).catch(err => {
      this._logger.error(`ERRROR GENERATING INTRANET PACKAGE`, err);
    });
  }

  async updateDomainNameChatbot(chatbotId: number, updateChatbot: UpdateChatbotDto): Promise<void> {
    this._logger.log('Update Chatbot Domain Name ...', chatbotId.toString());

    const chatbot: Chatbot = await this._chatbotService.findOneWithParam({
      id: chatbotId,
      status: ChatbotStatus.running
    });
    if (!chatbot) {
      throw new HttpException(`Ce chatbot n'existe pas ou n'est pas en fonctionnement.`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

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
      this._logger.log('Update Chatbot Domain Name completed', chatbotId.toString());
    } catch (err) {
      this._logger.error('Update Chatbot Domain Name failed', err);
    }
  }

  async updateChatbot(chatbotId: number, updateChatbot: LaunchUpdateChatbotDto) {
    this._logger.log('Update Chatbot...', chatbotId.toString());

    const chatbot: Chatbot = await this._chatbotService.findOneWithParam({
      id: chatbotId,
      status: ChatbotStatus.running
    });
    if (!chatbot) {
      throw new HttpException(`Ce chatbot n'existe pas ou n'est pas en fonctionnement.`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const host_url = chatbot.domain_name ? `https://${chatbot.domain_name}` : `http://${chatbot.ip_adress}`;

    try {
      const updateForm = new FormData();
      updateForm.append('updateFront', updateChatbot.updateFront.toString());
      updateForm.append('updateBack', updateChatbot.updateBack.toString());
      updateForm.append('updateRasa', updateChatbot.updateRasa.toString());
      updateForm.append('frontBranch', chatbot.front_branch);
      updateForm.append('backBranch', chatbot.back_branch);
      updateForm.append('botBranch', chatbot.bot_branch);
      chatbot.domain_name ? updateForm.append('domainName', chatbot.domain_name) : null;
      updateForm.append('nginx_conf', fs.createReadStream(`${this._gitDir}/roles/chatbotGeneration/files/nginx.conf`));
      updateForm.append('nginx_site', fs.createReadStream(`${this._gitDir}/roles/chatbotGeneration/files/nginx_conf.cfg`));
      const headers = {
        ...updateForm.getHeaders(),
        ...{'x-api-key': chatbot.api_key},
      };
      await this._http.post(
        `${host_url}/api/update`,
        updateForm,
        {headers: headers}
      ).subscribe();
      this._logger.log('Update Chatbot completed', chatbotId.toString());
    } catch (err) {
      this._logger.error('Update Chatbot failed', err);
    }
  }
}
