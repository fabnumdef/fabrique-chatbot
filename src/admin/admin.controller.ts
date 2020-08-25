import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Injectable,
  UseGuards
} from '@nestjs/common';
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
import { LaunchUpdateChatbotDto } from "@dto/launch-update-chatbot.dto";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { UpdateChatbotDto } from "@dto/update-chatbot.dto";
import { DeleteResult, Not } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import { Job, Queue } from "bull";

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Injectable()
export class AdminController {
  constructor(private readonly _userService: UserService,
              private readonly _chatbotService: ChatbotService,
              @InjectQueue('chatbot_update') private readonly chatbotUpdateQueue: Queue) {
  }

  @Get('user')
  @ApiOperation({summary: 'Return all the users'})
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  async getUsers(): Promise<UserDto[]> {
    const users: User[] = await this._userService.findAll();
    return plainToClass(UserDto, camelcaseKeys(users, {deep: true}));
  }

  @Delete('user/:email')
  @ApiOperation({summary: 'Delete user'})
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  async deleteUser(@Param('email') email: string): Promise<DeleteResult> {
    return this._userService.deleteUser(email);
  }

  @Get('chatbot')
  @ApiOperation({summary: 'Return all the chatbots'})
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  async getChatbots(): Promise<ChatbotDto[]> {
    const chatbots: Chatbot[] = await this._chatbotService.findAll({
      relations: ['user'],
      where: [
        {status: Not(ChatbotStatus.deleted)}
      ],
      order: {id: 'ASC'}
    });
    return plainToClass(ChatbotDto, camelcaseKeys(chatbots, {deep: true}));
  }

  @Delete('chatbot/:id')
  @ApiOperation({summary: 'Delete chatbot'})
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  async deleteChatbot(@Param('id') chatbotId: number): Promise<Chatbot> {
    return this._chatbotService.delete(chatbotId);
  }

  @Put('chatbot/:id')
  @ApiOperation({summary: 'Update chatbot & status'})
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  async update(@Param('id') chatbotId: number,
               @Body() updateChatbot: UpdateChatbotDto): Promise<Chatbot> {
    await this.chatbotUpdateQueue.add('update_status', {chatbotId, updateChatbot});
    return;
  }

  @Post('chatbot/update/:id')
  @ApiOperation({summary: 'Launch chatbot update'})
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  async updateChatbot(@Param('id') chatbotId: number,
                      @Body() updateChatbot: LaunchUpdateChatbotDto): Promise<any> {
    const chatbot: Chatbot = await this._chatbotService.findOneWithParam({
      id: chatbotId,
      status: ChatbotStatus.running
    });
    if (!chatbot) {
      throw new HttpException(`Ce chatbot n'existe pas ou n'est pas en fonctionnement.`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    await this.chatbotUpdateQueue.add('update', {chatbot, updateChatbot});
    return;
  }

  @Get('chatbot/queue')
  @ApiOperation({summary: 'Return the current queue'})
  @UseGuards(RolesGuard)
  @Roles(UserRole.admin)
  async getChatbotsQueue(): Promise<Job[]> {
    const queue: Job[] = await this.chatbotUpdateQueue.getJobs(['completed', 'waiting', 'active', 'delayed', 'failed', 'paused']);
    return queue;
  }
}
