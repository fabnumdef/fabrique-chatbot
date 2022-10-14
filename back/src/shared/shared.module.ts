import { HttpModule, Module } from '@nestjs/common';
import { MailService } from "./services/mail.service";

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
