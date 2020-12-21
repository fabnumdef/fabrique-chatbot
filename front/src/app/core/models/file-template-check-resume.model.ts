export class FileTemplateCheckResume {
  categories: string[];
  questionsNumber: number;
  warnings: { [key: string]: string } = {};
  errors: { [key: string]: string } = {};
}
