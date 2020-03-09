import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { TemplateFileService } from "../template-file/template-file.service";
import { BotCreationDto } from "./dto/bot-creation.dto";

@ApiTags('bot')
@Controller('bot')
export class BotController {

  @Post('create')
  @UseInterceptors(FileInterceptor(
    'file',
    {
      fileFilter: TemplateFileService.excelFileFilter,
    }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Bot configuration',
    type: BotCreationDto,
  })
  create(@UploadedFile() file, @Body() botConfiguration: BotCreationDto) {
    console.log('bot config', botConfiguration);
  }
}
