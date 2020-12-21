import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole } from "@enum/user-role.enum";

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @MaxLength(200)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  chatbotTheme: string;

  @IsString()
  @IsOptional()
  role: UserRole;
}
