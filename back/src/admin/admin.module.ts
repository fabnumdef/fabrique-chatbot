import { HttpModule, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from "../user/user.module";
import { ChatbotModule } from "../chatbot/chatbot.module";
import { AdminService } from './admin.service';

@Module({
  imports: [
    UserModule,
    ChatbotModule,
    HttpModule
  ],
  controllers: [
    AdminController
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule {
}
