import { HttpService, Injectable } from '@nestjs/common';
import { ChatbotService } from "./chatbot.service";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { AnsiblePlaybook, Options } from 'ansible-playbook-cli-js';
import { Chatbot } from "@entity/chatbot.entity";
import * as fs from "fs";
import { MailService } from "../shared/services/mail.service";
import { dotenvToJson, execShellCommand, jsonToDotenv } from "@core/utils";
import { UpdateChatbotDto } from "@dto/update-chatbot.dto";
import { BotLogger } from "../logger/bot.logger";
import * as path from "path";

const crypto = require('crypto');
const FormData = require('form-data');
const yaml = require('js-yaml');

@Injectable()
export class ChatbotGenerationService {

  private _appDir = process.env.NODE_ENV === 'local' ? path.resolve(__dirname, '../../../ansible') : '/var/www/fabrique-chatbot-back/ansible';
  private readonly _logger = new BotLogger('ChatbotGenerationService');

  constructor(private readonly _chatbotService: ChatbotService,
              private readonly _http: HttpService,
              private readonly _mailService: MailService) {
  }

  async updateChatbot(chatbot: Chatbot, updateChatbot: UpdateChatbotDto): Promise<void> {
    if(!process.env.INTRANET || process.env.INTRANET === 'false') {
      await this.updateChatbotRepos(chatbot);
    }

    const credentials = {
      USER_PASSWORD: updateChatbot.userPassword ? updateChatbot.userPassword : null,
      DB_PASSWORD: updateChatbot.dbPassword ? updateChatbot.dbPassword : null,
      botDomain: chatbot.domain_name
    };

    try {
      fs.writeFileSync(`/tmp/.env`, Buffer.from(chatbot.dot_env));
    } catch (err) {
      this._logger.error(`ERROR WRITING FILE - ${chatbot.id}`, err);
    }

    // update email config & domain name
    await execShellCommand(`ansible-vault decrypt --vault-password-file roles/vars/password_file /tmp/.env`, `${this._appDir}`).then();
    let dotenv = fs.readFileSync(`/tmp/.env`, 'utf8');
    dotenv = {
      ...dotenvToJson(dotenv), ...{
        MAIL_HOST: process.env.MAIL_HOST,
        MAIL_PORT: process.env.MAIL_PORT,
        MAIL_USER: process.env.MAIL_USER,
        MAIL_PASSWORD: process.env.MAIL_PASSWORD,
        HOST_URL: chatbot.domain_name ? `https://${chatbot.domain_name}` : `http://${chatbot.ip_adress}`
      }
    };

    try {
      fs.writeFileSync(`/tmp/.env`, jsonToDotenv(dotenv), 'utf8');
    } catch (err) {
      this._logger.error(`ERROR WRITING FILE - ${chatbot.id}`, err);
    }

    await execShellCommand(`ansible-vault encrypt --vault-password-file roles/vars/password_file /tmp/.env`, `${this._appDir}`).then();

    const playbookOptions = new Options(this._appDir);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);

    await ansiblePlaybook.command(`playChatbotgeneration.yml --vault-password-file roles/vars/password_file -i ${chatbot.ip_adress}, -e '${JSON.stringify(credentials)}'`).then(async (result) => {
      await this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.running});
      this._logger.log(`CHATBOT UPDATED - ${chatbot.id} - ${chatbot.name}`);
      this._logger.log(result);
    }).catch(err => {
      this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.error_configuration});
      this._logger.error(`ERROR UPDATING CHATBOT - ${chatbot.id} - ${chatbot.name}`, err);
    });

    try {
      fs.unlinkSync(`/tmp/.env`);
    } catch (err) {
      this._logger.error(`ERROR ERASING FILE - ${chatbot.id}`, err);
    }
  }

  async updateChatbotRepos(chatbot: Chatbot) {
    const playbookOptions = new Options(this._appDir);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    const extraVars = {
      frontBranch: chatbot.front_branch,
      backBranch: chatbot.back_branch,
      botBranch: chatbot.bot_branch
    };
    this._logger.log(`UPDATING CHATBOTS REPOSITORIES`);
    await ansiblePlaybook.command(`playUsineupdaterepos.yml --vault-password-file roles/vars/password_file -e '${JSON.stringify(extraVars)}'`).then((result) => {
      this._logger.log(result);
    }).catch(err => {
      this._logger.error(`ERRROR UPDATING CHATBOTS REPOSITORIES`, err);
    });
  }

  async initChatbot(chatbot: Chatbot) {
    this._logger.log('BEGIN INIT CHATBOT');
    chatbot = await this._chatbotService.findOne(chatbot.id);
    const password = crypto.randomBytes(12).toString('hex');
    const user = chatbot.user;

    const userToCreate = {
      email: user ? user.email : 'vincent.laine.utc@gmail.com',
      firstName: user ? user.first_name : 'Vincent',
      lastName: user ? user.last_name : 'Lainé',
      password: password
    };

    const domain = chatbot.domain_name ? `https://${chatbot.domain_name}` : `http://${chatbot.ip_adress}`;

    // Create first admin user
    await this._http.post(`${domain}/api/user/admin`, userToCreate).toPromise().then();
    this._logger.log('ADMIN USER CREATED');

    // Log user
    let token;
    await this._http.post(`${domain}/api/auth/login`, {
      email: userToCreate.email,
      password: password
    }).toPromise().then(response => {
      token = response.data.chatbotToken;
    });
    this._logger.log('LOGGED WITH ADMIN USER');

    // Create other users
    if (chatbot.users && chatbot.users.length > 0) {
      chatbot.users.forEach(chatbotUser => {
        const password = crypto.randomBytes(12).toString('hex');
        this._http.post(`${domain}/api/user`, {...chatbotUser, ...{password: password}}).toPromise().then();
      });
      this._logger.log('CREATED CHATBOT USERS');
    }

    // Import file
    const form = new FormData();
    form.append('file', chatbot.file_data, chatbot.file);
    form.append('deleteIntents', true.toString());
    let headers: any = {
      ...form.getHeaders(),
      ...{Authorization: `Bearer ${token}`},
    };
    await this._http.post(`${domain}/api/file/import`, form, {headers: headers}).toPromise().then();
    this._logger.log('IMPORT FILE');

    // Import config
    const configForm = new FormData();
    configForm.append('icon', chatbot.icon_data, chatbot.icon);
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
    await this._http.post(`${domain}/api/config`, configForm, {headers: headers}).toPromise().then();
    this._logger.log('IMPORT CONFIG');

    // Generate Api Key
    headers = {
      Authorization: `Bearer ${token}`
    };
    let apiKey;
    await this._http.post(`${domain}/api/config/api-key`, null, {headers: headers}).toPromise().then(async (response) => {
      apiKey = response.data.apiKey;
    });
    if(apiKey) {
      this._logger.log('BEGIN INIT CHATBOT - STORING API KEY');
      await this._chatbotService.findAndUpdate(chatbot.id, {api_key: apiKey});
    } else {
      this._logger.error('BEGIN INIT CHATBOT - ERROR RETRIEVING API KEY', null);
    }

    // Train Rasa
    headers = {
      Authorization: `Bearer ${token}`
    };
    this._logger.log('BEGIN INIT CHATBOT - TRAIN');
    await this._http.post(`${domain}/api/rasa/train`, {}, {headers: headers}).toPromise().then();
    this._logger.log('END INIT CHATBOT');
  }
}
