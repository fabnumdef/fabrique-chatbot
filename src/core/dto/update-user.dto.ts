import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRole } from "@enum/user-role.enum";

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  chatbotTheme: string;

  @IsString()
  @IsOptional()
  role: UserRole;
}
