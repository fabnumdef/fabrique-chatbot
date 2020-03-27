import { Module } from '@nestjs/common';
import { TerminusModule } from "@nestjs/terminus";
import { TerminusOptionsService } from "./health/terminus-options.service";
import { ChatbotModule } from './chatbot/chatbot.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@entity/user.entity";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from './user/user.module';
import { Chatbot } from "@entity/chatbot.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      "entities": [User, Chatbot],
      "synchronize": true
    }),
    ChatbotModule,
    UserModule
  ],
})
export class AppModule {
}
