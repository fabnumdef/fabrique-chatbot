import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from "../user/user.module";
import { ChatbotModule } from "../chatbot/chatbot.module";

@Module({
  imports: [
    UserModule,
    ChatbotModule
  ],
  controllers: [
    AdminController
  ]
})
export class AdminModule {}
