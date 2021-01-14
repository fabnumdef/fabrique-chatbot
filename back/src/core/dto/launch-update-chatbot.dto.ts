import { IsBoolean, IsNotEmpty } from "class-validator";

export class LaunchUpdateChatbotDto {
  @IsBoolean()
  @IsNotEmpty()
  updateFront: boolean;

  @IsBoolean()
  @IsNotEmpty()
  updateBack: boolean;

  @IsBoolean()
  @IsNotEmpty()
  updateRasa: boolean;

  @IsBoolean()
  @IsNotEmpty()
  updateLogs: boolean;

  constructor(updateFront = false, updateBack = false, updateRasa = false, updateLogs = false) {
    this.updateFront = updateFront;
    this.updateBack = updateBack;
    this.updateRasa = updateRasa
    this.updateLogs = updateLogs;
  }

}
