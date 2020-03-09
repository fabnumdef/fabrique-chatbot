import { Module } from '@nestjs/common';
import { TemplateFileController } from './template-file.controller';
import { TemplateFileService } from "./template-file.service";

@Module({
  imports: [],
  controllers: [TemplateFileController],
  providers: [TemplateFileService],
})
export class TemplateFileModule {}
