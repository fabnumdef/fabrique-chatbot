import { IsOptional, IsString, Validate } from "class-validator";
import { IpAdressValidator } from "@core/validators/ip-adress.validator";
import { ChatbotStatus } from "@enum/chatbot-status.enum";

export class UpdateChatbotDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  rootPassword: string;

  @IsString()
  @Validate(IpAdressValidator)
  @IsOptional()
  ipAdress: string;

  // TODO DELETE
  @IsString()
  @IsOptional()
  status: ChatbotStatus;
}
