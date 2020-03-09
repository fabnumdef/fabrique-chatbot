import { Test, TestingModule } from '@nestjs/testing';
import { TemplateFileController } from './template-file.controller';

describe('TemplateFile Controller', () => {
  let controller: TemplateFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateFileController],
    }).compile();

    controller = module.get<TemplateFileController>(TemplateFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
