export class TemplateFileCheckResumeDto {
  categories: string[];
  questionsNumber: number;
  // Key / value object
  warnings: { [key: string]: string } = {};
  errors: { [key: string]: string } = {};
}
