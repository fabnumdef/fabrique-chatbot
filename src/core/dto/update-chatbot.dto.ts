import { IsOptional, IsString, MaxLength, Validate } from "class-validator";
import { IpAdressValidator } from "@core/validators/ip-adress.validator";
import { ChatbotStatus } from "@enum/chatbot-status.enum";
import { DomainNameValidator } from "@core/validators/domain-name.validator";

export class UpdateChatbotDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  rootUser: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  rootPassword: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  userPassword: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  dbPassword: string;

  @IsString()
  @Validate(IpAdressValidator)
  @IsOptional()
  @MaxLength(50)
  ipAdress: string;

  @IsString()
  @Validate(DomainNameValidator, [{admin: true}])
  @IsOptional()
  @MaxLength(50)
  domainName: string;

  @IsString()
  @IsOptional()
  status: ChatbotStatus;

  @IsString()
  @IsOptional()
  frontBranch: string;

  @IsString()
  @IsOptional()
  backBranch: string;

  @IsString()
  @IsOptional()
  botBranch: string;

  @IsString()
  @IsOptional()
  apiKey: string;
}
