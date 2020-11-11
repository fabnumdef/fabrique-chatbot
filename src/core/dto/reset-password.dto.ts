import { IsNotEmpty, IsString, Matches } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[@$!%*?&]).{8,200}$/gm)
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
