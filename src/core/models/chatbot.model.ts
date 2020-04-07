import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ChatbotStatus } from "@enum/chatbot-status.enum";

export class ChatbotModel {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  file: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  primary_color: string;

  @IsString()
  @IsNotEmpty()
  secondary_color: string;

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
  intra_def: boolean = true;

  @IsString()
  @IsOptional()
  status: ChatbotStatus;
}
