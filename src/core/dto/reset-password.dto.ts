import { IsNotEmpty, IsString, Length } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 200)
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
