import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FileModel {
  @IsString()
  @IsNotEmpty()
  fieldname: string;

  @IsString()
  @IsNotEmpty()
  originalname: string;

  @IsString()
  @IsNotEmpty()
  encoding: string;

  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  buffer: Buffer;
}
