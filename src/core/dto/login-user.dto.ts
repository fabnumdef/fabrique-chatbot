import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @IsString()
  @MaxLength(200)
  password: string;
}
