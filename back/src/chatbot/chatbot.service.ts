import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Sheet2JSONOpts, WorkBook, WorkSheet } from "xlsx";
import { TemplateFileDto, TemplateResponseType } from "@dto/template-file.dto";
import { TemplateFileCheckResumeDto } from "@dto/template-file-check-resume.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chatbot } from "@entity/chatbot.entity";
import { ChatbotModel } from "@model/chatbot.model";
import { FileModel } from "@model/file.model";
import { OvhStorageService } from "../shared/services/ovh-storage.service";
import { forkJoin } from "rxjs";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { UpdateChatbotDto } from "@dto/update-chatbot.dto";
import * as fs from "fs";
import { AnsiblePlaybook, Options } from "ansible-playbook-cli-js";
import { execShellCommand, jsonToDotenv } from "@core/utils";
import snakecaseKeys = require("snakecase-keys");
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

const yaml = require('js-yaml');
const crypto = require('crypto');
const XLSX = require('xlsx');

@Injectable()
export class ChatbotService {
  private _xlsx = XLSX;

  constructor(@InjectRepository(Chatbot) private readonly _chatbotsRepository: Repository<Chatbot>,
              private readonly _ovhStorageService: OvhStorageService,
              @InjectQueue('chatbot_update') private readonly _chatbotUpdateQueue: Queue) {
  }

  findAll(params?: any): Promise<Chatbot[]> {
    return this._chatbotsRepository.find(params);
  }

  findOne(id: number): Promise<Chatbot> {
    return this._chatbotsRepository.findOne(id);
  }

  findOneWithParam(param: any): Promise<Chatbot> {
    return this._chatbotsRepository.findOne(param);
  }

  async create(chatbot: ChatbotModel, file?: FileModel, icon?: FileModel): Promise<ChatbotModel> {
    const chatbotSaved: Chatbot = await this._chatbotsRepository.save(chatbot);
    if (!file || !icon) {
      return chatbotSaved;
    }
    chatbotSaved.file = `${chatbotSaved.id.toString(10)}/${file.originalname}`;
    chatbotSaved.icon = `${chatbotSaved.id.toString(10)}/${icon.originalname}`;
    await forkJoin({
      file: this._ovhStorageService.set(file, chatbotSaved.file),
      icon: this._ovhStorageService.set(icon, chatbotSaved.icon)
    }).toPromise().then();

    return this._chatbotsRepository.save(chatbotSaved);
  }

  async findAndUpdate(id: number, data: any): Promise<Chatbot> {
    const chatbotExists = await this.findOne(id);
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
    let chatbot = await this.findOne(id);
    if (!chatbot) {
      throw new HttpException('Ce chatbot n\'existe pas.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (updateChatbot.status) {
      chatbot = await this.findAndUpdate(chatbot.id, {
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
        if (!chatbot.intra_def && (!updateChatbot.ipAdress || !updateChatbot.rootPassword || !updateChatbot.rootUser || !updateChatbot.userPassword)) {
          throw new HttpException(`L'adresse IP du VPS, l'user root, le password root et le password utilisateur sont obligatoires pour changer de statut.`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        await this._chatbotUpdateQueue.add('pending_configuration', {chatbot, updateChatbot});
        return;
      case ChatbotStatus.error_configuration:
        if (!chatbot.intra_def && !updateChatbot.ipAdress) {
          throw new HttpException(`L'adresse IP du VPS est obligatoire pour changer de statut.`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return this.findAndUpdate(chatbot.id, {
          status: ChatbotStatus.pending_configuration,
          ip_adress: updateChatbot.ipAdress
        });
      case ChatbotStatus.pending_configuration:
        if (!chatbot.intra_def) {
          throw new HttpException(`Le chatbot va être configuré, merci de patienter.`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // TODO: generate intraDef package
        return this.findAndUpdate(chatbot.id, {status: ChatbotStatus.configuration});
      case ChatbotStatus.configuration:
        if (!chatbot.intra_def) {
          throw new HttpException(`Le chatbot est en train d'être configuré, merci de patienter.`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return this.findAndUpdate(chatbot.id, {status: ChatbotStatus.running});
      case ChatbotStatus.running:
        return this.findAndUpdate(chatbot.id, snakecaseKeys(updateChatbot));
      case ChatbotStatus.deleted:
        throw new HttpException(`Le chatbot est archivé, impossible de le modifier.`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
      'Expire le': 'expires_at'
    };
    const options: Sheet2JSONOpts = {};
    const excelJson = this._xlsx.utils.sheet_to_json(worksheet, options);
    const templateFile: TemplateFileDto[] = excelJson.map((t: TemplateFileDto, idx: number) => {
      for (let key of Object.keys(t)) {
        if (!!headers[key]) {
          t[headers[key]] = t[key];
        }
        delete t[key];
      }
      t.id = t.id?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W/g, '_');
      if (!t.id) {
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

  public async generateChatbot(chatbot: Chatbot, updateChatbot: UpdateChatbotDto) {
    // generate user password & db password
    const passwordLength = 32;

    const dbPassword = crypto
      .randomBytes(Math.ceil((passwordLength * 3) / 4))
      .toString('base64') // convert to base64 format
      .slice(0, passwordLength) // return required number of characters
      .replace(/\+/g, '0') // replace '+' with '0'
      .replace(/\//g, '0'); // replace '/' with '0'
    const jwtSecret = crypto
      .randomBytes(Math.ceil((passwordLength * 3) / 4))
      .toString('base64') // convert to base64 format
      .slice(0, passwordLength) // return required number of characters
      .replace(/\+/g, '0') // replace '+' with '0'
      .replace(/\//g, '0'); // replace '/' with '0'

    updateChatbot.dbPassword = dbPassword

    const credentials = {
      USER_PASSWORD: updateChatbot.userPassword,
      DB_PASSWORD: updateChatbot.dbPassword,
      ROOT_USER: updateChatbot.rootUser,
      ROOT_PASSWORD: updateChatbot.rootPassword
    };

    const env = {
      NODE_ENV: 'prod',
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '5432',
      DATABASE_USER: 'rasa_user',
      DATABASE_PASSWORD: updateChatbot.dbPassword,
      DATABASE_NAME: 'rasa',
      JWT_SECRET: jwtSecret,
      MAIL_HOST: process.env.MAIL_HOST,
      MAIL_PORT: process.env.MAIL_PORT,
      MAIL_USER: process.env.MAIL_USER,
      MAIL_PASSWORD: process.env.MAIL_PASSWORD
    };

    const yamlStr = yaml.safeDump(credentials);
    const appDir = '/var/www/fabrique-chatbot-back';
    fs.writeFileSync(`${appDir}/ansible/chatbot/credentials.yml`, yamlStr, 'utf8');
    fs.writeFileSync(`${appDir}/ansible/chatbot/.env`, jsonToDotenv(env), 'utf8');

    await execShellCommand(`ansible-vault encrypt --vault-password-file fabrique/password_file chatbot/credentials.yml`, `${appDir}/ansible`).then();
    await execShellCommand(`ansible-vault encrypt --vault-password-file fabrique/password_file chatbot/.env`, `${appDir}/ansible`).then();
    const envEncrypted = fs.readFileSync(`${appDir}/ansible/chatbot/.env`, 'utf8');
    this._ovhStorageService.set(envEncrypted, `${chatbot.id.toString(10)}/.env`);

    const playbookOptions = new Options(`${appDir}/ansible/chatbot`);
    const ansiblePlaybook = new AnsiblePlaybook(playbookOptions);
    await ansiblePlaybook.command(`prebook.yml --vault-password-file ../fabrique/password_file -i ${updateChatbot.ipAdress},`).then(result => console.log(result));
    await ansiblePlaybook.command(`debianserver.yml --vault-password-file ../fabrique/password_file -i ${updateChatbot.ipAdress},`).then(result => console.log(result));
    // await ansiblePlaybook.command(`prometheus.yml --vault-password-file ../fabrique/password_file -i ${updateChatbot.ipAdress},`).then(result => console.log(result));
    await ansiblePlaybook.command(`chatbot.yml --vault-password-file ../fabrique/password_file -i ${updateChatbot.ipAdress},`).then(result => console.log(result));

    fs.unlinkSync(`${appDir}/ansible/chatbot/credentials.yml`);
    fs.unlinkSync(`${appDir}/ansible/chatbot/.env`);
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
