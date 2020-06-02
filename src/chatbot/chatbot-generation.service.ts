import { HttpService, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from "@nestjs/schedule";
import { ChatbotService } from "./chatbot.service";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { IsNull, Not } from "typeorm";
import { AnsiblePlaybook, Options } from 'ansible-playbook-cli-js';
import { Chatbot } from "@entity/chatbot.entity";
import { LaunchUpdateChatbotDto } from "@dto/launch-update-chatbot.dto";
import { OvhStorageService } from "../shared/services/ovh-storage.service";
import * as fs from "fs";
import { MailService } from "../shared/services/mail.service";
const crypto = require('crypto');
const FormData = require('form-data');

@Injectable()
export class ChatbotGenerationService {

  private _appDir = '/var/www/fabrique-chatbot-back/ansible';

  constructor(private readonly _chatbotService: ChatbotService,
              private readonly _ovhStorageService: OvhStorageService,
              private readonly _http: HttpService,
              private readonly _mailService: MailService) {
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  // @Cron(CronExpression.EVERY_30_SECONDS)
  async checkChatbots() {
    const botsToBeCreated: Chatbot[] = await this._chatbotService.findAll({
      status: ChatbotStatus.pending_configuration,
      ip_adress: Not(IsNull())
    });
    if (!botsToBeCreated || botsToBeCreated.length < 1) {
      return;
    }
    console.log(`${new Date().toLocaleString()} - Chatbots waiting for creation`, botsToBeCreated.length);

    this.updateChatbotRepos();

    this._generateChatbots();

    /**
     * Récupérer et stocker en variable d'environnement la clef SSH
     * Récupérer et stocker dans un fichier le vault-password
     *
     * Générer les variables d'environnements et les encrypter avec le vault-password
     * Stocker le fichier .env crypté dans dans l'object storage au cas ou
     *
     * Appel au back pour créer le premier utilisateur
     * Appel au back pour importer la base documentaire (remplissage de la bdd) - A voir comment faire niveau sécu
     * Appel au back pour générer les fichiers Rasa + Train Rasa
     */
  }

  async updateChatbot(chatbot: Chatbot, updateChatbot: LaunchUpdateChatbotDto) {
    // Get credentials
    const file = await this._ovhStorageService.get(`${chatbot.id.toString(10)}/credentials.yml`).then().catch(() => {
      this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.error_configuration});
    });
    const dotenv = await this._ovhStorageService.get(`${chatbot.id.toString(10)}/.env`).then().catch(() => {
      this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.error_configuration});
    });
    fs.writeFileSync(`${this._appDir}/chatbot/credentials.yml`, file, 'utf8');
    fs.writeFileSync(`${this._appDir}/chatbot/.env`, dotenv, 'utf8');

    const playbookOptions = new Options(`${this._appDir}/chatbot`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    await ansiblePlaybook.command(`generate-chatbot.yml --vault-password-file ../fabrique/password_file -i ${chatbot.ip_adress}, -e '${JSON.stringify(updateChatbot)}'`).then(async (result) => {
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

  async updateChatbotRepos() {
    const playbookOptions = new Options(`${this._appDir}/fabrique`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    await ansiblePlaybook.command(`update-chatbot-repo.yml --vault-id dev@password_file`).then((result) => {
      console.log(`${new Date().toLocaleString()} - UPDATING CHATBOTS REPOSITORIES`);
      console.log(result);
    }).catch(error => {
      console.error(`${new Date().toLocaleString()} - ERRROR UPDATING CHATBOTS REPOSITORIES`);
    });
  }

  /************************************************************************************ PRIVATE FUNCTIONS ************************************************************************************/

  private async _generateChatbots() {
    // On les récupère ici pour être sûr (si la commande ansible précédente prend trop de temps)
    const botsToBeCreated: Chatbot[] = await this._chatbotService.findAll({
      where: {
        status: ChatbotStatus.pending_configuration,
        ip_adress: Not(IsNull()),
      },
      relations: ['user']
    });
    for (const chatbot of botsToBeCreated) {
      await this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.configuration});
      console.log(`${new Date().toLocaleString()} - GENERATING CHATBOT - ${chatbot.id} - ${chatbot.name}`);
      const extraVars: LaunchUpdateChatbotDto = new LaunchUpdateChatbotDto(true, true, true);
      await this.updateChatbot(chatbot, extraVars);
      this._initChatbot(chatbot);
    }
  }

  private async _initChatbot(chatbot: Chatbot) {
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
    this._mailService.sendEmail(user.email, 'Création de compte', 'create-chatbot', {
      firstName: user.first_name,
      ipAdress: chatbot.ip_adress,
      password: password
    });

    // Log user & import file
    let token;
    await this._http.post(`http://${chatbot.ip_adress}/api/auth/login`, {
      email: user.email,
      password: password
    }).toPromise().then(response => {
      token = response.data.chatbotToken;
    });

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
    configForm.append('solution', chatbot.solution);
    await this._http.post(`http://${chatbot.ip_adress}/api/config`, configForm, {headers: headers}).toPromise().then();

    // Train Rasa
    headers = {
      Authorization: `Bearer ${token}`
    };
    await this._http.post(`http://${chatbot.ip_adress}/api/rasa/train`, {}, {headers: headers}).toPromise().then();
  }
}
