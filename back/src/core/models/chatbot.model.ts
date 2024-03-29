import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { UserModel } from "@model/user.model";
import { ChatbotUserModel } from "@model/chatbot-user.model";

export class ChatbotModel {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  function: string;

  @IsString()
  @IsNotEmpty()
  file: string;

  @IsNotEmpty()
  file_data: any;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsNotEmpty()
  icon_data: any;

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
  intra_def: boolean = false;

  @IsString()
  @IsNotEmpty()
  accept_conditions: boolean = false;

  @IsString()
  @IsOptional()
  status: ChatbotStatus;

  @IsObject()
  @IsOptional()
  user: UserModel;

  @IsObject()
  @IsOptional()
  users: ChatbotUserModel[];
}
