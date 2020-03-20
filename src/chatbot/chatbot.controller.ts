import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { BotCreationDto } from "../core/dto/bot-creation.dto";
import { FileUploadDto } from "../core/dto/file-upload.dto";
import { ChatbotService } from "./chatbot.service";

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly _chatbotService: ChatbotService) {
  }

  @Post('create')
  @UseInterceptors(FileInterceptor(
    'file',
    {
      fileFilter: ChatbotService.excelFileFilter,
    }))
  @ApiConsumes('multipart/form-data')
  create(@UploadedFile() file, @Body() botConfiguration: BotCreationDto) {
    console.log('bot config', botConfiguration);
  }

  @Post('check-file')
  @UseInterceptors(FileInterceptor(
    'file',
    {
      fileFilter: ChatbotService.excelFileFilter,
    }
  ))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Template file (excel)',
    type: FileUploadDto,
  })
  checkTemplateFile(@UploadedFile() file) {
    return this._chatbotService.checkTemplateFile(file);
  }

  @Post()
  @UseInterceptors(FileInterceptor(
    'file',
    {
      fileFilter: ChatbotService.excelFileFilter,
    }
  ))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Template file (excel)',
    type: FileUploadDto,
  })
  convertToRasaFiles(@UploadedFile() file) {
    return this._chatbotService.convertToRasaFiles(file);
  }
}
