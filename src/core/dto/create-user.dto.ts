import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(200)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  chatbotTheme: string;
}
