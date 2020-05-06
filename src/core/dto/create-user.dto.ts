import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9._%+-]+@([A-Za-z0-9._%+-]*\.)?gouv\.fr$/gm)
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
