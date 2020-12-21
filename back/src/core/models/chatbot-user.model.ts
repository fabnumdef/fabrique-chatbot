import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChatbotUserRole } from "@enum/chatbot-user-role.enum";

export class ChatbotUserModel {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsOptional()
  role: ChatbotUserRole;
}
