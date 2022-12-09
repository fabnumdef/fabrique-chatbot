import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { Sheet2JSONOpts, WorkBook, WorkSheet } from "xlsx";
import { TemplateFileDto, TemplateResponseType } from "@dto/template-file.dto";
import { TemplateFileCheckResumeDto } from "@dto/template-file-check-resume.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chatbot } from "@entity/chatbot.entity";
import { ChatbotModel } from "@model/chatbot.model";
import { FileModel } from "@model/file.model";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { UpdateChatbotDto } from "@dto/update-chatbot.dto";
import * as fs from "fs";
import { AnsiblePlaybook, Options } from "ansible-playbook-cli-js";
import { execShellCommand, jsonToDotenv } from "@core/utils";
import snakecaseKeys = require("snakecase-keys");
import { MailService } from "../shared/services/mail.service";
import { BotLogger } from "../logger/bot.logger";
import * as path from "path";

const crypto = require('crypto');
const XLSX = require('xlsx');
import * as FormData from 'form-data';

@Injectable()
export class ChatbotService {
  private _xlsx = XLSX;
  private readonly _logger = new BotLogger('ChatbotService');

  constructor(@InjectRepository(Chatbot) private readonly _chatbotsRepository: Repository<Chatbot>,
              private readonly _mailService: MailService,
              private readonly _http: HttpService) {
  }

  findAll(params?: any): Promise<Chatbot[]> {
    return this._chatbotsRepository.find(params);
  }

  findOne(id: number, withoutFiles = false): Promise<Chatbot> {
    return this._chatbotsRepository.findOne(id, {
      select: withoutFiles ? ['id', 'name', 'function', 'primary_color', 'secondary_color', 'problematic', 'audience',
        'ip_adress', 'domain_name', 'intra_def', 'accept_conditions', 'status', 'created_at', 'front_branch',
        'back_branch', 'bot_branch', 'api_key'] : []
    });
  }

  findOneWithParam(param: any): Promise<Chatbot> {
    return this._chatbotsRepository.findOne(param);
  }

  async create(chatbot: ChatbotModel, file?: FileModel, icon?: FileModel): Promise<ChatbotModel> {
    if (!!file) {
      chatbot.file = file.originalname;
      chatbot.file_data = file.buffer
    }
    if (!!icon) {
      chatbot.icon = icon.originalname;
      chatbot.icon_data = icon.buffer
    }
    const chatbotSaved: Chatbot = await this._chatbotsRepository.save(chatbot);

    await this._mailService.sendEmail(['vincent.laine@beta.gouv.fr', 'linna.taing@beta.gouv.fr'],
      'Usine à Chatbots - Demande de création d\'un chatbot',
      'new-chatbot',
      {  // Data to be sent to template engine.
        env: process.env.NODE_ENV,
        id: chatbotSaved.id,
        name: chatbotSaved.name,
        function: chatbotSaved.function,
        primary_color: chatbotSaved.primary_color,
        secondary_color: chatbotSaved.secondary_color,
        problematic: chatbotSaved.problematic,
        audience: chatbotSaved.audience,
        domain_name: chatbotSaved.domain_name,
        intra_def: chatbotSaved.intra_def,
        user: chatbotSaved.user.email,
        created_at: chatbotSaved.created_at
      }, [
        {
          filename: chatbotSaved.file,
          content: chatbotSaved.file_data
        },
        {
          filename: chatbotSaved.icon,
          content: chatbotSaved.icon_data
        }
      ])
      .then();

    return chatbotSaved;
  }

  async findAndUpdate(id: number, data: any): Promise<Chatbot> {
    const chatbotExists = await this.findOne(id, true);
    if (!chatbotExists) {
      throw new HttpException('Ce chatbot n\'existe pas.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this._chatbotsRepository.save({
      ...chatbotExists,
      ...data
    });
  }

  checkTemplateFile(file): TemplateFileCheckResumeDto {
    let workbook: WorkBook;
    let worksheet: WorkSheet;
    let templateFile: TemplateFileDto[];
    try {
      workbook = this._xlsx.read(file.buffer);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      templateFile = this._convertExcelToJson(worksheet);
    } catch (error) {
      this._logger.error('CHECK TEMPLATE FILE', error);
      throw new HttpException('Le fichier fournit ne peut pas être lu.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const templateFileCheckResume = new TemplateFileCheckResumeDto();
    this._computeTemplateFile(templateFile, templateFileCheckResume);
    this._checkFile(templateFile, templateFileCheckResume);

    return templateFileCheckResume;
  }

  async delete(id: number): Promise<Chatbot> {
    return await this.findAndUpdate(id, {
      ip_adress: null,
      status: ChatbotStatus.deleted
    });
  }

  async update(id: number, updateChatbot: UpdateChatbotDto): Promise<Chatbot> {
    this._logger.log('Update Chatbot Status ...', id.toString());
    let chatbot = await this.findOne(id, true);
    this._logger.log('CHATBOT', JSON.stringify(chatbot));
    if (!chatbot) {
      throw new HttpException('Ce chatbot n\'existe pas.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (updateChatbot.status) {
      await this.findAndUpdate(chatbot.id, {
        status: updateChatbot.status
      });
    }

    if (updateChatbot.ipAdress || updateChatbot.domainName) {
      chatbot = await this.findAndUpdate(chatbot.id, {
        ip_adress: updateChatbot.ipAdress,
        domain_name: updateChatbot.domainName
      });
    }

    switch (chatbot.status) {
      case ChatbotStatus.pending:
        return this.findAndUpdate(chatbot.id, {
          status: ChatbotStatus.creation
        });
      case ChatbotStatus.creation:
        if (!chatbot.intra_def && (!updateChatbot.ipAdress || !updateChatbot.userPassword)) {
          throw new HttpException(`L'adresse IP du VPS, l'user root, le password root et le password utilisateur sont obligatoires pour changer de statut.`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (updateChatbot.launchGenerationManually) {
          await this._initDataChatbot(chatbot);
        } else {
          await this._generateChatbot(chatbot, updateChatbot);
        }
        return this.findAndUpdate(chatbot.id, {
          status: ChatbotStatus.running
        });
      case ChatbotStatus.running:
        return this.findAndUpdate(chatbot.id, snakecaseKeys(updateChatbot));
      case ChatbotStatus.deleted:
        throw new HttpException(`Le chatbot est archivé, impossible de le modifier.`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this._logger.log('Update Chatbot Status completed', id.toString());
  }

  /************************************************************************************ PRIVATE FUNCTIONS ************************************************************************************/

  /**
   * Converti une feuille excel en entrée vers un tableau d'objets TemplateFileDto
   * @param worksheet
   */
  private _convertExcelToJson(worksheet: WorkSheet): TemplateFileDto[] {
    const headers = {
      'ID': 'id',
      'Catégorie': 'category',
      'Question': 'main_question',
      'Type de réponse': 'response_type',
      'Réponse(s)': 'response',
      'Questions synonymes (à séparer par un point-virgule ;)': 'questions',
      'Expire le (DD/MM/YYYY)': 'expires_at'
    };
    const options: Sheet2JSONOpts = {};
    const excelJson = this._xlsx.utils.sheet_to_json(worksheet, options);
    const templateFile: TemplateFileDto[] = excelJson.map((t: TemplateFileDto, idx: number) => {
      for (const key of Object.keys(t)) {
        if (!!headers[key]) {
          t[headers[key]] = t[key];
        }
        delete t[key];
      }
      t.id = t.id?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W/g, '_');
      if (!t.id) {
        // @ts-ignore
        t.id = excelJson[idx - 1].id;
      }
      t.questions = t.questions ? (<any>t.questions).split(';').map(q => q.trim()) : [];
      return t;
    });
    return templateFile;
  }

  /**
   * Extrait des premières stats du fichier excel vers le TemplateFileCheckResumeDto
   * @param templateFile
   * @param templateFileCheckResume
   */
  private _computeTemplateFile(templateFile: TemplateFileDto[], templateFileCheckResume: TemplateFileCheckResumeDto): void {
    templateFileCheckResume.categories = Array.from(new Set(templateFile.map(t => t.category))).filter(v => !!v);
    templateFileCheckResume.questionsNumber = templateFile.filter(t => !!t.main_question).length;
  }

  /**
   * Parcours du fichier excel et vérification que tout les éléments sont présents
   * @param templateFile
   * @param templateFileCheckResume
   */
  private _checkFile(templateFile: TemplateFileDto[], templateFileCheckResume?: TemplateFileCheckResumeDto): void | boolean {
    // ONLY FOR FABRIQUE, NOT BO
    if (!templateFile.find(t => t.id === 'phrase_presentation')) {
      this._addMessage(templateFileCheckResume.errors, -1, `La phrase de présentation n'est pas renseignée (id: phrase_presentation).`);
    }
    if (!templateFile.find(t => t.id === 'phrase_hors_sujet')) {
      this._addMessage(templateFileCheckResume.errors, -2, `La phrase d'hors sujet n'est pas renseignée (id: phrase_hors_sujet).`);
    }
    if (!templateFile.find(t => t.id === 'phrase_feedback')) {
      this._addMessage(templateFileCheckResume.errors, -2, `La phrase de feedback n'est pas renseignée (id: phrase_feedback).`);
    }
    templateFile.forEach((excelRow: TemplateFileDto, index: number) => {
      const excelIndex = index + 2;
      // ERRORS
      if (!excelRow.id) {
        this._addMessage(templateFileCheckResume.errors, excelIndex, `L'ID n'est pas renseigné.`);
      }
      if (excelRow.response && !excelRow.response_type) {
        this._addMessage(templateFileCheckResume.errors, excelIndex, `Le type de réponse n'est pas renseigné.`);
      }
      if (!excelRow.response && excelRow.response_type) {
        this._addMessage(templateFileCheckResume.errors, excelIndex, `La réponse n'est pas renseignée.`);
      }
      if (!excelRow.response && !excelRow.response_type) {
        this._addMessage(templateFileCheckResume.errors, excelIndex, `La réponse et le type de réponse n'est pas renseigné.`);
      }
      if ([TemplateResponseType.quick_reply, TemplateResponseType.image, TemplateResponseType.button].includes(excelRow.response_type)
        && ((templateFile[index - 1]?.response_type !== TemplateResponseType.text) || (templateFile[index - 1]?.id !== excelRow.id))) {
        this._addMessage(templateFileCheckResume.errors, excelIndex, `Ce type de réponse nécessite d'être précédée d'une réponse de type texte.`);
      }
      // Si il y a une question principale il est censé y avoir une réponse, une catégorie etc ...
      if (!!excelRow.main_question) {
        // WARNINGS
        if (!excelRow.category) {
          this._addMessage(templateFileCheckResume.warnings, excelIndex, `La catégorie n'est pas renseignée.`);
        }
        if (excelRow.questions.length < 1) {
          this._addMessage(templateFileCheckResume.warnings, excelIndex, `Aucune question synonyme n'a été renseignée, le chatbot aura du mal à reconnaitre cette demande.`);
        }
        // Si il n'y a pas de question principale, c'est censé être une suite de réponse (et donc avoir une question principale relié ou un lien vers cet id)
      } else {
        const excludedIds = ['phrase_presentation', 'phrase_hors_sujet', 'phrase_feedback'];
        const mainQuestion = templateFile.find(t =>
          (t.id === excelRow.id && !!t.main_question) || (t.response && t.response.includes(`<${excelRow.id}>`))
        );
        if (!mainQuestion && !excludedIds.includes(excelRow.id)) {
          this._addMessage(templateFileCheckResume.errors, excelIndex, `Aucune question n'est renseignée pour cet identifiant.`);
        }
      }
    });
  }

  /**
   * Rajout d'un message à un objet clef / valeur
   * Rajoute la clef (numéro de l'index) si elle n'existe pas
   * @param keyValueObject
   * @param index
   * @param message
   */
  private _addMessage(keyValueObject: { [key: string]: string }, index: number, message: string) {
    if (!keyValueObject[index]) {
      keyValueObject[index] = '';
    }
    keyValueObject[index] += !!keyValueObject[index] ? `\n` : '';
    keyValueObject[index] += message;
  }

  private async _generateChatbot(chatbot: Chatbot, updateChatbot: UpdateChatbotDto) {
    this._logger.log('Init Chatbot Server ...', chatbot.id.toString());

    // generate jwt secret
    const passwordLength = 32;
    const jwtSecret = crypto
      .randomBytes(Math.ceil((passwordLength * 3) / 4))
      .toString('base64') // convert to base64 format
      .slice(0, passwordLength) // return required number of characters
      .replace(/\+/g, '0') // replace '+' with '0'
      .replace(/\//g, '0'); // replace '/' with '0'

    const credentials: any = {
      USER_PASSWORD: updateChatbot.userPassword,
      DB_PASSWORD: updateChatbot.dbPassword,
      // ROOT_USER: updateChatbot.rootUser,
      // ROOT_PASSWORD: updateChatbot.rootPassword,
      frontBranch: updateChatbot.frontBranch,
      backBranch: updateChatbot.backBranch,
      botBranch: updateChatbot.botBranch,
      intranet: process.env.INTRANET
    };
    if (updateChatbot.domainName) {
      credentials.botDomain = updateChatbot.domainName
    }

    const env = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_HOST: process.env.DATABASE_HOST,
      DATABASE_PORT: process.env.DATABASE_PORT,
      DATABASE_USER: process.env.DATABASE_USER,
      DATABASE_PASSWORD: updateChatbot.dbPassword,
      DATABASE_NAME: updateChatbot.dbName,
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      JWT_SECRET: jwtSecret,
      MAIL_HOST: process.env.MAIL_HOST,
      MAIL_PORT: process.env.MAIL_PORT,
      MAIL_USER: process.env.MAIL_USER,
      MAIL_PASSWORD: process.env.MAIL_PASSWORD
    };

    const appDir = process.env.NODE_ENV === 'local' ? path.resolve(__dirname, '../../..') : '/var/www/git/fabrique-chatbot';
    if (updateChatbot.sshCert) {
      credentials.ansible_ssh_private_key_file = `${appDir}/ansible/roles/chatbotGeneration/files/id_ansible`;
      fs.writeFileSync(`${appDir}/ansible/roles/chatbotGeneration/files/id_ansible`, updateChatbot.sshCert, {
        encoding: 'utf8',
        mode: '600'
      });
    }
    fs.writeFileSync(`${appDir}/ansible/roles/chatbotGeneration/files/.env`, jsonToDotenv(env), 'utf8');

    const playbookOptions = new Options(`${appDir}/ansible`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    await ansiblePlaybook.command(`playChatbot.yml -i ${updateChatbot.ipAdress}, -e '${JSON.stringify(credentials)}'`).then(result => this._logger.log(result));

    fs.unlinkSync(`${appDir}/ansible/roles/chatbotGeneration/files/.env`);

    await this._initDataChatbot(chatbot);

    this._logger.log('Update Pending Configuration completed', chatbot.id.toString());
  }

  private async _initDataChatbot(chatbot: Chatbot) {
    this._logger.log('BEGIN INIT DATA CHATBOT');
    chatbot = await this.findOne(chatbot.id);
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
    if (apiKey) {
      this._logger.log('BEGIN INIT CHATBOT - STORING API KEY');
      await this.findAndUpdate(chatbot.id, {api_key: apiKey});
    } else {
      this._logger.error('BEGIN INIT CHATBOT - ERROR RETRIEVING API KEY', null);
    }

    // Train Rasa
    headers = {
      Authorization: `Bearer ${token}`
    };
    this._logger.log('BEGIN INIT CHATBOT - TRAIN');
    this._http.post(`${domain}/api/rasa/train`, {}, {headers: headers}).subscribe();
    this._logger.log('END INIT CHATBOT');
  }

  /************************************************************************************ STATIC ************************************************************************************/

  static excelFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
      return callback(new HttpException('Seul les fichiers en .xls et .xlsx sont acceptés.', HttpStatus.BAD_REQUEST), false);
    }
    return callback(null, true);
  };

  static imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|png|svg)$/)) {
      return callback(new HttpException('Seul les fichiers en .jpg, .png et .svg sont acceptés.', HttpStatus.BAD_REQUEST), false);
    }
    return callback(null, true);
  };

  static multipleFileFilters = (req, file, callback) => {
    if (file.fieldname === 'icon') {
      return ChatbotService.imageFileFilter(req, file, callback);
    } else {
      return ChatbotService.excelFileFilter(req, file, callback);
    }
  };
}
