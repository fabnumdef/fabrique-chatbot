import { ApiProperty } from "@nestjs/swagger";
import { FileUploadDto } from "@dto/file-upload.dto";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateChatbotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  function: string;

  @ApiProperty({type: 'string', format: 'binary'})
  file: FileUploadDto;

  @ApiProperty({type: 'string', format: 'binary'})
  icon: FileUploadDto;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  primaryColor: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  secondaryColor: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  problematic: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  audience: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  solution: string;

  @IsString()
  @IsNotEmpty()
  intraDef: boolean = false;

  @IsString()
  @IsNotEmpty()
  includeSmallTalk: boolean = true;
}
