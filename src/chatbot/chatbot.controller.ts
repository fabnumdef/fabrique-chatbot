import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { FileUploadDto } from "@dto/file-upload.dto";
import { ChatbotService } from "./chatbot.service";
import { plainToClass } from "class-transformer";
import { ChatbotDto } from "@dto/chatbot.dto";
import camelcaseKeys = require("camelcase-keys");
import { CreateChatbotDto } from "@dto/create-chatbot.dto";
import snakecaseKeys = require("snakecase-keys");
import { ChatbotModel } from "@model/chatbot.model";
import { JwtAuthGuard } from "@guard/jwt.guard";
import { FileModel } from "@model/file.model";

@ApiTags('chatbot')
@Controller('chatbot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly _chatbotService: ChatbotService) {
  }

  @Post('create')
  @UseInterceptors(FileFieldsInterceptor(
    [
      {name: 'file', maxCount: 1},
      {name: 'icon', maxCount: 1},
    ],
    {
      fileFilter: ChatbotService.multipleFileFilters
    }
  ))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({summary: 'Create chatbot'})
  async create(@UploadedFiles() files,
               @Body() botConfiguration: CreateChatbotDto) {
    const file: FileModel = files.file[0];
    const icon: FileModel = files.icon[0];
    const errors = this._chatbotService.checkTemplateFile(file).errors;
    if (errors && Object.keys(errors).length > 0) {
      throw new HttpException('Le fichier contient des erreurs bloquantes.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const botModel = await this._chatbotService.create(plainToClass(ChatbotModel, snakecaseKeys(botConfiguration)), file, icon);
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
}
