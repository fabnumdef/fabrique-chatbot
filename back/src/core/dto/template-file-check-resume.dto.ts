export class TemplateFileCheckResumeDto {
  categories: string[];
  questionsNumber: number;
  // Key / value object
  warnings: { [key: number]: string } = {};
  errors: { [key: number]: string } = {};
}
