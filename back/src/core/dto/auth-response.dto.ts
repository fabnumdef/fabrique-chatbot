import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { UserDto } from "@core/dto/user.dto";

export class AuthResponseDto {
  @IsString()
  @IsNotEmpty()
  chatbotFactoryToken: string;

  @IsNotEmpty()
  @IsObject()
  user: UserDto;
}
