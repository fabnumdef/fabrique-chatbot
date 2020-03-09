import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplateFileModule } from "./template-file/template-file.module";
import { TerminusModule } from "@nestjs/terminus";
import { TerminusOptionsService } from "./health/terminus-options.service";

@Module({
  imports: [
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
    TemplateFileModule
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
