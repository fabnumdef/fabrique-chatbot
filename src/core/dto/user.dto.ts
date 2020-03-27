import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from "@enum/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  chatbotTheme: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  role: UserRole;
}
