import { HttpService, Injectable } from '@nestjs/common';
import { ChatbotService } from "./chatbot.service";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { AnsiblePlaybook, Options } from 'ansible-playbook-cli-js';
import { Chatbot } from "@entity/chatbot.entity";
import { OvhStorageService } from "../shared/services/ovh-storage.service";
import * as fs from "fs";
import { MailService } from "../shared/services/mail.service";
import { dotenvToJson, execShellCommand, jsonToDotenv } from "@core/utils";
import { UpdateChatbotDto } from "@dto/update-chatbot.dto";
const crypto = require('crypto');
const FormData = require('form-data');
const yaml = require('js-yaml');

@Injectable()
export class ChatbotGenerationService {

  private _appDir = '/var/www/fabrique-chatbot-back/ansible';

  constructor(private readonly _chatbotService: ChatbotService,
              private readonly _ovhStorageService: OvhStorageService,
              private readonly _http: HttpService,
              private readonly _mailService: MailService) {
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  // // @Cron(CronExpression.EVERY_30_SECONDS)
  // async checkChatbots() {
  //   const botsToBeCreated: Chatbot[] = await this._chatbotService.findAll({
  //     status: ChatbotStatus.pending_configuration,
  //     ip_adress: Not(IsNull())
  //   });
  //   if (!botsToBeCreated || botsToBeCreated.length < 1) {
  //     return;
  //   }
  //   console.log(`${new Date().toLocaleString()} - Chatbots waiting for creation`, botsToBeCreated.length);
  //
  //   this._generateChatbots();
  // }

  async updateChatbot(chatbot: Chatbot, updateChatbot: UpdateChatbotDto) {
    await this.updateChatbotRepos(chatbot);

    const credentials = {
      USER_PASSWORD: updateChatbot.userPassword,
      ROOT_USER: updateChatbot.rootUser,
      ROOT_PASSWORD: updateChatbot.rootPassword
    };

    let dotenv = await this._ovhStorageService.get(`${chatbot.id.toString(10)}/.env`).then().catch(() => {
      this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.error_configuration});
    });
    fs.writeFileSync(`${this._appDir}/chatbot/credentials.yml`, yaml.safeDump(credentials), 'utf8');
    fs.writeFileSync(`${this._appDir}/chatbot/.env`, dotenv, 'utf8');

    // update email config & domain name
    await execShellCommand(`ansible-vault decrypt --vault-password-file fabrique/password_file chatbot/.env`, `${this._appDir}`).then();
    dotenv = fs.readFileSync(`${this._appDir}/chatbot/.env`, 'utf8');
    dotenv = {...dotenvToJson(dotenv), ...{
        MAIL_HOST: process.env.MAIL_HOST,
        MAIL_PORT: process.env.MAIL_PORT,
        MAIL_USER: process.env.MAIL_USER,
        MAIL_PASSWORD: process.env.MAIL_PASSWORD,
        HOST_URL: chatbot.domain_name ? `https://${chatbot.domain_name}` : `http://${chatbot.ip_adress}`
      }};
    fs.writeFileSync(`${this._appDir}/chatbot/.env`, jsonToDotenv(dotenv), 'utf8');
    await execShellCommand(`ansible-vault encrypt --vault-password-file fabrique/password_file chatbot/.env`, `${this._appDir}`).then();

    const playbookOptions = new Options(`${this._appDir}/chatbot`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    const extraVars = {botDomain: chatbot.domain_name};
    await ansiblePlaybook.command(`generate-chatbot.yml --vault-password-file ../fabrique/password_file -i ${chatbot.ip_adress}, -e '${JSON.stringify(extraVars)}'`).then(async (result) => {
      await this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.running});
      console.log(`${new Date().toLocaleString()} - CHATBOT UPDATED - ${chatbot.id} - ${chatbot.name}`);
      console.log(result);
    }).catch(() => {
      this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.error_configuration});
      console.error(`${new Date().toLocaleString()} - ERROR UPDATING CHATBOT - ${chatbot.id} - ${chatbot.name}`);
    });

    fs.unlinkSync(`${this._appDir}/chatbot/credentials.yml`);
    fs.unlinkSync(`${this._appDir}/chatbot/.env`);
  }

  async updateChatbotRepos(chatbot: Chatbot) {
    const playbookOptions = new Options(`${this._appDir}/fabrique`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    const extraVars = {frontBranch: chatbot.front_branch, backBranch: chatbot.back_branch, botBranch: chatbot.bot_branch};
    await ansiblePlaybook.command(`update-chatbot-repo.yml --vault-id dev@password_file -e '${JSON.stringify(extraVars)}'`).then((result) => {
      console.log(`${new Date().toLocaleString()} - UPDATING CHATBOTS REPOSITORIES`);
      console.log(result);
    }).catch(error => {
      console.error(`${new Date().toLocaleString()} - ERRROR UPDATING CHATBOTS REPOSITORIES`);
    });
  }

  async initChatbot(chatbot: Chatbot) {
    const password = crypto.randomBytes(12).toString('hex');
    const user = chatbot.user;
    const file = await this._ovhStorageService.get(chatbot.file).then();
    const icon = await this._ovhStorageService.get(chatbot.icon).then();

    const userToCreate = {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      password: password
    };

    // Create first admin user
    await this._http.post(`http://${chatbot.ip_adress}/api/user/admin`, userToCreate).toPromise().then();

    // Log user
    let token;
    await this._http.post(`http://${chatbot.ip_adress}/api/auth/login`, {
      email: user.email,
      password: password
    }).toPromise().then(response => {
      token = response.data.chatbotToken;
    });

    // Create other users
    if(chatbot.users && chatbot.users.length > 0) {
      chatbot.users.forEach(chatbotUser => {
        const password = crypto.randomBytes(12).toString('hex');
        this._http.post(`http://${chatbot.ip_adress}/api/user`, {...chatbotUser, ...{password: password}}).toPromise().then();
      });
    }

    // Import file
    const form = new FormData();
    form.append('file', Buffer.from(file.buffer), chatbot.file);
    form.append('deleteIntents', true.toString());
    let headers: any = {
      ...form.getHeaders(),
      ...{Authorization: `Bearer ${token}`},
    };
    await this._http.post(`http://${chatbot.ip_adress}/api/file/import`, form, {headers: headers}).toPromise().then();

    // Import config
    const configForm = new FormData();
    configForm.append('icon', Buffer.from(icon.buffer), chatbot.icon);
    configForm.append('name', chatbot.name);
    configForm.append('function', chatbot.function);
    configForm.append('primaryColor', chatbot.primary_color);
    configForm.append('secondaryColor', chatbot.secondary_color);
    configForm.append('problematic', chatbot.problematic);
    configForm.append('audience', chatbot.audience);
    headers = {
      ...configForm.getHeaders(),
      ...{Authorization: `Bearer ${token}`},
    };
    await this._http.post(`http://${chatbot.ip_adress}/api/config`, configForm, {headers: headers}).toPromise().then();

    // Train Rasa
    headers = {
      Authorization: `Bearer ${token}`
    };
    await this._http.post(`http://${chatbot.ip_adress}/api/rasa/train`, {}, {headers: headers}).toPromise().then();
  }

  /************************************************************************************ PRIVATE FUNCTIONS ************************************************************************************/

  // private async _generateChatbots() {
  //   // On les récupère ici pour être sûr (si la commande ansible précédente prend trop de temps)
  //   const botsToBeCreated: Chatbot[] = await this._chatbotService.findAll({
  //     where: {
  //       status: ChatbotStatus.pending_configuration,
  //       ip_adress: Not(IsNull()),
  //     },
  //     relations: ['user']
  //   });
  //   for (const chatbot of botsToBeCreated) {
  //     await this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.configuration});
  //     console.log(`${new Date().toLocaleString()} - GENERATING CHATBOT - ${chatbot.id} - ${chatbot.name}`);
  //     const extraVars: LaunchUpdateChatbotDto = new LaunchUpdateChatbotDto(true, true, true);
  //     await this.updateChatbot(chatbot, extraVars);
  //     this._initChatbot(chatbot);
  //   }
  // }
}
