import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TemplateFileService } from "./template-file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileUploadDto } from "./dto/file-upload.dto";

@ApiTags('template-file')
@Controller('template-file')
export class TemplateFileController {
  constructor(private readonly _templateFileService: TemplateFileService) {
  }

  @Post('check')
  @UseInterceptors(FileInterceptor(
    'file',
    {
      fileFilter: TemplateFileService.excelFileFilter,
    }
  ))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Template file (excel)',
    type: FileUploadDto,
  })
  checkTemplateFile(@UploadedFile() file) {
    return this._templateFileService.checkTemplateFile(file);
  }

  @Post()
  @UseInterceptors(FileInterceptor(
    'file',
    {
      fileFilter: TemplateFileService.excelFileFilter,
    }
  ))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Template file (excel)',
    type: FileUploadDto,
  })
  convertToRasaFiles(@UploadedFile() file) {
    return this._templateFileService.convertToRasaFiles(file);
  }
}
