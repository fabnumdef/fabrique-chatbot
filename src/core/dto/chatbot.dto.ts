import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { UserDto } from "@dto/user.dto";

export class ChatbotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  primaryColor: string;

  @IsString()
  @IsNotEmpty()
  secondaryColor: string;

  @IsString()
  @IsNotEmpty()
  problematic: string;

  @IsString()
  @IsNotEmpty()
  audience: string;

  @IsString()
  @IsNotEmpty()
  intraDef: boolean = true;

  @IsString()
  @IsOptional()
  status: ChatbotStatus;

  @IsObject()
  @IsOptional()
  user: UserDto;
}
