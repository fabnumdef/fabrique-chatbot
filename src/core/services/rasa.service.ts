import { TemplateFileDto, TemplateResponseType } from "../../template-file/dto/template-file.dto";
import { RasaNlu } from "../models/rasa-nlu.model";
import { RasaButtonModel, RasaDomain, RasaUtterResponse } from "../models/rasa-domain.model";

const fs = require('fs');
const yaml = require('js-yaml');

export class RasaService {

  /**
   * Converti le tableau de templateFile vers 3 fichiers séparés
   * nlu.json
   * domain.yml
   * stories.md
   * Ravi de voir que Rasa a pensé aux devs sur ce genre de fichier (troll)
   * @param templateFile
   */
  static jsonToRasa(templateFile: TemplateFileDto[]) {
    const nlu = new RasaNlu();
    const domain = new RasaDomain();
    let stories: string = '';

    // Intents list
    domain.intents = Array.from(new Set(templateFile.map(t => t.id))).filter(v => !!v);

    templateFile.forEach(t => {
      if (t.id && t.main_question) {
        nlu.rasa_nlu_data.common_examples.push({intent: t.id, text: t.main_question});
      }
      if (t.id && t.questions.length > 0) {
        t.questions.forEach(q => {
          nlu.rasa_nlu_data.common_examples.push({intent: t.id, text: q});
        });
      }
    });

    domain.intents.forEach(intent => {
      const responses = this.generateDomainUtter(templateFile.filter(t => t.id === intent));
      stories += this.generateStory(Object.keys(responses), intent);
      domain.responses = Object.assign(responses, domain.responses);
    });

    fs.writeFileSync('C:\\Users\\laine\\Documents\\beta.gouv\\fabrique-chatbot-back\\files\\nlu.json', JSON.stringify(nlu), 'utf8');
    fs.writeFileSync('C:\\Users\\laine\\Documents\\beta.gouv\\fabrique-chatbot-back\\files\\domain.yml', yaml.safeDump(domain), 'utf8');
    fs.writeFileSync('C:\\Users\\laine\\Documents\\beta.gouv\\fabrique-chatbot-back\\files\\stories.md', stories, 'utf8');
  }

  static rasaToJson(): TemplateFileDto[] {
    return null;
  }

  /**
   * Génération des réponses (utter) pour un intent donné
   * @param templateFiles
   */
  static generateDomainUtter(templateFiles: TemplateFileDto[]): { [key: string]: RasaUtterResponse[] } {
    const intent = templateFiles[0].id;
    const responses: { [key: string]: RasaUtterResponse[] } = {};
    templateFiles.forEach((t: TemplateFileDto, index: number) => {
      switch (t.response_type) {
        case TemplateResponseType.text:
          responses[`utter_${intent}_${index}`] = [{text: t.response}];
          break;
        case TemplateResponseType.image:
          responses[`utter_${intent}_${index - 1}`][0].image = t.response;
          break;
        case TemplateResponseType.button:
          const buttons: string[] = t.response.split(';');
          responses[`utter_${intent}_${index - 1}`][0].buttons = [];
          let utter_buttons = responses[`utter_${intent}_${index - 1}`][0].buttons;
          buttons.forEach(button => {
            utter_buttons.push(new RasaButtonModel(button));
          });
          responses[`utter_${intent}_${index - 1}`][0].buttons = [new RasaButtonModel(t.response)];
          break;
        case TemplateResponseType.quick_reply:
          const quick_replies: string[] = t.response.split(';');
          responses[`utter_${intent}_${index - 1}`][0].buttons = [];
          let utter_buttons_bis = responses[`utter_${intent}_${index - 1}`][0].buttons;
          quick_replies.forEach(quick_reply => {
            utter_buttons_bis.push(new RasaButtonModel(quick_reply));
          });
          break;
      }
    });
    return responses;
  }

  /**
   * Generate a story in Markdown format from utters of an intent
   * @param utters
   * @param intent
   */
  static generateStory(utters: string[], intent: string): string {
    let story = `## ${intent}`;
    story += `\n* ${intent}`;
    utters.forEach(utter => {
      story += `\n  - ${utter}`;
    });
    story += `\n\n`;
    return story;
  }
}
