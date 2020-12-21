import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from "@enum/user-role.enum";
import { Exclude } from "class-transformer";

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  chatbotTheme: string;

  @IsString()
  @IsOptional()
  role: UserRole;

  @Exclude()
  resetPasswordToken: string;

  @Exclude()
  resetPasswordExpires: number;
}
