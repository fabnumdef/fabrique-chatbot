import {  Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from "../user/user.module";
import { ChatbotModule } from "../chatbot/chatbot.module";
import { AdminService } from './admin.service';
import { HttpModule } from "@nestjs/axios";

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
