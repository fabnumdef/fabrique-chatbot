import { Injectable } from '@nestjs/common';
import { Cron } from "@nestjs/schedule";
import { ChatbotService } from "./chatbot.service";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { IsNull, Not } from "typeorm";
import { AnsiblePlaybook, Options } from 'ansible-playbook-cli-js';
import { Chatbot } from "@entity/chatbot.entity";
import { LaunchUpdateChatbotDto } from "@dto/launch-update-chatbot.dto";
import { OvhStorageService } from "../shared/services/ovh-storage.service";
import * as fs from "fs";

@Injectable()
export class ChatbotGenerationService {

  private _appDir = '/var/www/fabrique-chatbot-back/ansible';

  constructor(private readonly _chatbotService: ChatbotService,
              private readonly _ovhStorageService: OvhStorageService) {
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  @Cron('*/30 * * * * *')
  async checkChatbots() {
    const botsToBeCreated: Chatbot[] = await this._chatbotService.findAll({
      status: ChatbotStatus.pending_configuration,
      ip_adress: Not(IsNull())
    });
    if (!botsToBeCreated || botsToBeCreated.length < 1) {
      return;
    }
    console.log('Chatbots waiting for creation', botsToBeCreated.length);

    this.updateChatbotRepos();

    this._generateChatbots();

    /**
     * TO DO: prebook.yml & debianserver.yml ne changent pas
     * Récupérer et stocker en variable d'environnement la clef SSH
     * Récupérer et stocker dans un fichier le vault-password
     *
     * Générer les variables d'environnements et les encrypter avec le vault-password
     * Stocker le fichier .env crypté dans dans l'object storage au cas ou
     *
     * Copier chatbot-back
     * Copier chatbot-front
     * Copier chatbot-template
     * Copier la base documentaire
     *
     * Lancer les npm install / npm build
     * Lancer chatbot-back
     * Lancer chatbot-front
     *
     * Appel au back pour créer le premier utilisateur
     * Appel au back pour importer la base documentaire (remplissage de la bdd) - A voir comment faire niveau sécu
     * Appel au back pour générer les fichiers Rasa + Train Rasa
     *
     * Lancer chatbot-template
     *
     * pending -> générer le script ansible
     */
  }

  async updateChatbot(chatbot: Chatbot, updateChatbot: LaunchUpdateChatbotDto) {
    // Get credentials
    const file = await this._ovhStorageService.get(`${chatbot.id.toString(10)}/credentials.yml`).then();
    const dotenv = await this._ovhStorageService.get(`${chatbot.id.toString(10)}/.env`).then();
    fs.writeFileSync(`${this._appDir}/chatbot/credentials.yml`, file, 'utf8');
    fs.writeFileSync(`${this._appDir}/chatbot/.env`, dotenv, 'utf8');

    const playbookOptions = new Options(`${this._appDir}/chatbot`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    await ansiblePlaybook.command(`generate-chatbot.yml --vault-password-file ../fabrique/password_file -i ${chatbot.ip_adress}, -e '${JSON.stringify(updateChatbot)}'`).then(async (result) => {
      await this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.running});
      console.log(`CHATBOT UPDATED - ${chatbot.id} - ${chatbot.name}`);
      console.log(result);
    }).catch(() => {
      this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.error_configuration});
      console.error(`ERROR UPDATING CHATBOT - ${chatbot.id} - ${chatbot.name}`);
    });

    fs.unlinkSync(`${this._appDir}/chatbot/credentials.yml`);
    fs.unlinkSync(`${this._appDir}/chatbot/.env`);
  }

  async updateChatbotRepos() {
    const playbookOptions = new Options(`${this._appDir}/fabrique`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    await ansiblePlaybook.command(`update-chatbot-repo.yml --vault-id dev@password_file`).then((result) => {
      console.log('UPDATING CHATBOTS REPOSITORIES');
      console.log(result);
    }).catch(error => {
      console.error('ERRROR UPDATING CHATBOTS REPOSITORIES');
    });
  }

  /************************************************************************************ PRIVATE FUNCTIONS ************************************************************************************/

  private async _generateChatbots() {
    // On les récupère ici pour être sûr (si la commande ansible précédente prend trop de temps)
    const botsToBeCreated: Chatbot[] = await this._chatbotService.findAll({
      status: ChatbotStatus.pending_configuration,
      ip_adress: Not(IsNull())
    });
    for (const chatbot of botsToBeCreated) {
      await this._chatbotService.findAndUpdate(chatbot.id, {status: ChatbotStatus.configuration});
      console.log(`GENERATING CHATBOT - ${chatbot.id} - ${chatbot.name}`);
      const extraVars: LaunchUpdateChatbotDto = new LaunchUpdateChatbotDto(true, true, true);
      await this.updateChatbot(chatbot, extraVars);
    }
  }
}
