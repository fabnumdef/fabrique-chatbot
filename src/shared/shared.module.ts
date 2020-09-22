import { HttpModule, Module } from '@nestjs/common';
import { MailService } from "./services/mail.service";
import { OvhStorageService } from "./services/ovh-storage.service";

@Module({
  imports: [
    HttpModule
  ],
  providers: [
    MailService,
    OvhStorageService
  ],
  exports: [
    MailService,
    OvhStorageService
  ]
})
export class SharedModule {}
