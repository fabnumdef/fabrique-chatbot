import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { UserModel } from "@model/user.model";

export class ChatbotModel {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  function: string;

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

  @IsObject()
  @IsOptional()
  user: UserModel;
}
