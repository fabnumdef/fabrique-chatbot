import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Sheet2JSONOpts, WorkBook, WorkSheet } from "xlsx";
import { TemplateFileDto } from "@dto/template-file.dto";
import { TemplateFileCheckResumeDto } from "@dto/template-file-check-resume.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chatbot } from "@entity/chatbot.entity";
import { ChatbotModel } from "@model/chatbot.model";
import { FileModel } from "@model/file.model";
import { OvhStorageService } from "../shared/services/ovh-storage.service";
import { forkJoin } from "rxjs";

const XLSX = require('xlsx');

@Injectable()
export class ChatbotService {
  private _xlsx = XLSX;

  constructor(@InjectRepository(Chatbot) private _chatbotsRepository: Repository<Chatbot>,
              private _ovhStorageService: OvhStorageService) {
  }

  findAll(): Promise<Chatbot[]> {
    return this._chatbotsRepository.find();
  }

  async create(chatbot: ChatbotModel, file?: FileModel, icon?: FileModel): Promise<ChatbotModel> {
    let chatbotSaved: Chatbot = await this._chatbotsRepository.save(chatbot);
    if(!file || !icon) {
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

  // convertToRasaFiles(file): any {
  //   const workbook: WorkBook = XLSX.read(file.buffer);
  //   const worksheet: WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const templateFile: TemplateFileDto[] = this.convertExcelToJson(worksheet);
  //   RasaService.jsonToRasa(templateFile);
  // }

  // convertToAnsibleScript(file): any {
  //
  // }

  /************************************************************************************ PRIVATE FUNCTIONS ************************************************************************************/

  /**
   * Converti une feuille excel en entrée vers un tableau d'objets TemplateFileDto
   * @param worksheet
   */
  private _convertExcelToJson(worksheet: WorkSheet): TemplateFileDto[] {
    const options: Sheet2JSONOpts = {
      header: ['id', 'category', 'main_question', 'response_type', 'response', '', 'questions'],
      range: 1
    };
    const templateFile: TemplateFileDto[] = this._xlsx.utils.sheet_to_json(worksheet, options).map((t: TemplateFileDto) => {
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
        const mainQuestion = templateFile.find(t =>
          (t.id === excelRow.id && !!t.main_question) || (t.response && t.response.includes(`<${excelRow.id}>`))
        );
        if (!mainQuestion) {
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

  /************************************************************************************ STATIC ************************************************************************************/

  static excelFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
      return callback(new Error('Seul les fichiers en .xls et .xlsx sont acceptés.'), false);
    }
    return callback(null, true);
  };

  static imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|png)$/)) {
      return callback(new Error('Seul les fichiers en .jpg et .png sont acceptés.'), false);
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
