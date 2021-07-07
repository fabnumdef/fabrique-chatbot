import { Module } from '@nestjs/common';
import { BotLogger } from "./bot.logger";

@Module({
  providers: [BotLogger],
  exports: [BotLogger],
})
export class LoggerModule {}
