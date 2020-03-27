import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadDto } from "@dto/file-upload.dto";
import { ChatbotService } from "./chatbot.service";
import { plainToClass } from "class-transformer";
import { ChatbotDto } from "@dto/chatbot.dto";
import { Chatbot } from "@entity/chatbot.entity";
import camelcaseKeys = require("camelcase-keys");
import { CreateChatbotDto } from "@dto/create-chatbot.dto";
import snakecaseKeys = require("snakecase-keys");
import { ChatbotModel } from "@model/chatbot.model";

@ApiTags('chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly _chatbotService: ChatbotService) {
  }

  @Get('')
  @ApiOperation({summary: 'Return all the chatbots'})
  async getChatbots(): Promise<ChatbotDto[]> {
    const chatbots: Chatbot[] = await this._chatbotService.findAll();
    return plainToClass(ChatbotDto, camelcaseKeys(chatbots, {deep: true}));
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        fileFilter: ChatbotService.excelFileFilter,
      }),
    FileInterceptor(
      'icon',
      {
        fileFilter: ChatbotService.imageFileFilter,
      })
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({summary: 'Create chatbot'})
  async create(@UploadedFile('file') file,
         @UploadedFile('icon') icon,
         @Body() botConfiguration: CreateChatbotDto) {
    const errors = this._chatbotService.checkTemplateFile(file).errors;
    if (errors && Object.keys(errors).length > 0) {
      throw 'Fichier incorrect';
    }
    // this._chatbotService.convertToAnsibleScript(file);
    console.log('bot config', botConfiguration);
    const botModel = await this._chatbotService.create(plainToClass(ChatbotModel, snakecaseKeys(botConfiguration)));
    return plainToClass(ChatbotDto, camelcaseKeys(botModel, {deep: true}));
  }

  @Post('check-file')
  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        fileFilter: ChatbotService.excelFileFilter,
      }
    )
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Template file (excel)',
    type: FileUploadDto,
  })
  @ApiOperation({summary: 'Check excel file'})
  checkTemplateFile(@UploadedFile() file) {
    return this._chatbotService.checkTemplateFile(file);
  }

  // TODO: A transférer vers chatbot-back
  @Post()
  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        fileFilter: ChatbotService.excelFileFilter,
      }
    )
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Template file (excel)',
    type: FileUploadDto,
  })
  convertToRasaFiles(@UploadedFile() file) {
    return this._chatbotService.convertToRasaFiles(file);
  }
}
