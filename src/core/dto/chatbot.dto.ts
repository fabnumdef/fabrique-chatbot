import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ChatbotStatus } from "@enum/chatbot-status.enum";

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
  solution: string;

  @IsString()
  @IsNotEmpty()
  intraDef: boolean = true;

  @IsString()
  @IsOptional()
  status: ChatbotStatus;
}
