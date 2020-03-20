import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from "@nestjs/terminus";
import { TerminusOptionsService } from "./health/terminus-options.service";
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
    ChatbotModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {
}
