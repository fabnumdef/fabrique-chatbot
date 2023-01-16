import { MailService } from "./services/mail.service";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    HttpModule
  ],
  providers: [
    MailService
  ],
  exports: [
    MailService
  ]
})
export class SharedModule {}
