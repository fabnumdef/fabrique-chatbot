import { Injectable } from '@nestjs/common';
import { Sheet2JSONOpts, WorkBook, WorkSheet } from "xlsx";
import { TemplateFileDto } from "../core/dto/template-file.dto";
import { TemplateFileCheckResumeDto } from "../core/dto/template-file-check-resume.dto";
import { RasaService } from "../core/services/rasa.service";
const XLSX = require('xlsx');

@Injectable()
export class ChatbotService {
  checkTemplateFile(file): any {
    const workbook: WorkBook = XLSX.read(file.buffer);
    const worksheet: WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const templateFile: TemplateFileDto[] = this.convertExcelToJson(worksheet);
    const templateFileCheckResume = new TemplateFileCheckResumeDto();
    this.computeTemplateFile(templateFile, templateFileCheckResume);
    this.checkFile(templateFile, templateFileCheckResume);

    return templateFileCheckResume;
  }

  convertToRasaFiles(file): any {
    const workbook: WorkBook = XLSX.read(file.buffer);
    const worksheet: WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const templateFile: TemplateFileDto[] = this.convertExcelToJson(worksheet);
    RasaService.jsonToRasa(templateFile);
  }

  /************************************************************************************ PRIVATE FUNCTIONS ************************************************************************************/

  /**
   * Converti une feuille excel en entrée vers un tableau d'objets TemplateFileDto
   * @param worksheet
   */
  private convertExcelToJson(worksheet: WorkSheet): TemplateFileDto[] {
    const options: Sheet2JSONOpts = {
      header: ['id', 'category', 'main_question', 'response_type', 'response', '', 'questions'],
      range: 1
    };
    const templateFile: TemplateFileDto[] = XLSX.utils.sheet_to_json(worksheet, options).map((t: TemplateFileDto) => {
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
  private computeTemplateFile(templateFile: TemplateFileDto[], templateFileCheckResume: TemplateFileCheckResumeDto): void {
    templateFileCheckResume.categories = Array.from(new Set(templateFile.map(t => t.category))).filter(v => !!v);
    templateFileCheckResume.questionsNumber = templateFile.filter(t => !!t.main_question).length;
  }

  /**
   * Parcours du fichier excel et vérification que tout les éléments sont présents
   * @param templateFile
   * @param templateFileCheckResume
   */
  private checkFile(templateFile: TemplateFileDto[], templateFileCheckResume?: TemplateFileCheckResumeDto): void | boolean {
    templateFile.forEach((excelRow: TemplateFileDto, index: number) => {
      const excelIndex = index + 2;
      // ERRORS
      if (!excelRow.id) {
        this.addMessage(templateFileCheckResume.errors, excelIndex, `L'ID n'est pas renseigné.`);
      }
      if (excelRow.response && !excelRow.response_type) {
        this.addMessage(templateFileCheckResume.errors, excelIndex, `Le type de réponse n'est pas renseigné.`);
      }
      if (!excelRow.response && !excelRow.response_type) {
        this.addMessage(templateFileCheckResume.errors, excelIndex, `La réponse n'est pas renseignée.`);
      }
      // Si il y a une question principale il est censé y avoir une réponse, une catégorie etc ...
      if (!!excelRow.main_question) {
        // WARNINGS
        if (!excelRow.category) {
          this.addMessage(templateFileCheckResume.warnings, excelIndex, `La catégorie n'est pas renseignée.`);
        }
        if (excelRow.questions.length < 1) {
          this.addMessage(templateFileCheckResume.warnings, excelIndex, `Aucune question synonyme n'a été renseignée, le chatbot aura du mal à reconnaitre cette demande.`);
        }
        // Si il n'y a pas de question principale, c'est censé être une suite de réponse (et donc avoir une question principale relié ou un lien vers cet id)
      } else {
        const mainQuestion = templateFile.find(t =>
          (t.id === excelRow.id && !!t.main_question) || t.response.includes(`<${excelRow.id}>`)
        );
        if (!mainQuestion) {
          this.addMessage(templateFileCheckResume.errors, excelIndex, `Aucune question n'est renseignée pour cet identifiant.`);
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
  private addMessage(keyValueObject: { [key: string]: string }, index: number, message: string) {
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
    callback(null, true);
  };
}
