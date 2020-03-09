export interface TemplateFileDto {
  id: string;
  category: string;
  main_question: string;
  response_type: TemplateResponseType;
  response: string;
  questions: string [];
}

export enum TemplateResponseType {
  text = 'Texte',
  button = 'Lien',
  quick_reply = 'Réponse à choix',
  image = 'Image'
}
