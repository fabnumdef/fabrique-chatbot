import { FileUploadDto } from "../../template-file/dto/file-upload.dto";
import { ApiProperty } from "@nestjs/swagger";

export class BotCreationDto {
  @ApiProperty({type: 'string', format: 'binary'})
  file: FileUploadDto;

  @ApiProperty()
  botName: string;

  @ApiProperty()
  mainColor: string;
}
