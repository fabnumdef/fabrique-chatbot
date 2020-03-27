import { ApiProperty } from "@nestjs/swagger";
import { FileUploadDto } from "@dto/file-upload.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateChatbotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ApiProperty({type: 'string', format: 'binary'})
  file: FileUploadDto;

  @IsNotEmpty()
  @ApiProperty({type: 'string', format: 'binary'})
  icon: FileUploadDto;

  @IsString()
  @IsNotEmpty()
  primaryColor: string;

  @IsString()
  @IsNotEmpty()
  secondaryColor: string;

  @IsString()
  @IsNotEmpty()
  problematic: string;

  @IsString()
  @IsNotEmpty()
  audience: string;

  @IsString()
  @IsNotEmpty()
  solution: string;

  @IsString()
  @IsNotEmpty()
  intraDef: boolean = true;
}
