import { HttpModule, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from "../user/user.module";
import { ChatbotModule } from "../chatbot/chatbot.module";
import { BullModule } from "@nestjs/bull";
import { AdminProcessor } from "./admin.processor";

@Module({
  imports: [
    UserModule,
    ChatbotModule,
    BullModule.registerQueue({
      name: 'admin_update'
    }),
    HttpModule
  ],
  controllers: [
    AdminController
  ],
  providers: [
    AdminProcessor
  ]
})
export class AdminModule {
}
