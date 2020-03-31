import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@guard/jwt.guard";
import { UserDto } from "@dto/user.dto";
import { User } from "@entity/user.entity";
import { plainToClass } from "class-transformer";
import { UserService } from "../user/user.service";
import { ChatbotService } from "../chatbot/chatbot.service";
import camelcaseKeys = require("camelcase-keys");
import { ChatbotDto } from "@dto/chatbot.dto";
import { Chatbot } from "@entity/chatbot.entity";
import { Roles } from "@decorator/roles.decorator";
import { RolesGuard } from "@guard/roles.guard";
import { UserRole } from "@enum/user-role.enum";

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly _userService: UserService,
              private readonly _chatbotService: ChatbotService) {
  }

  @Get('users')
  @ApiOperation({ summary: 'Return all the users' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  async getUsers(): Promise<UserDto[]> {
    const users: User[] = await this._userService.findAll();
    return plainToClass(UserDto, camelcaseKeys(users, {deep: true}));
  }

  @Get('chatbots')
  @ApiOperation({summary: 'Return all the chatbots'})
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  async getChatbots(): Promise<ChatbotDto[]> {
    const chatbots: Chatbot[] = await this._chatbotService.findAll();
    return plainToClass(ChatbotDto, camelcaseKeys(chatbots, {deep: true}));
  }
}
