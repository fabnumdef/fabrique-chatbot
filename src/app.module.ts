import { Module } from '@nestjs/common';
import { TerminusModule } from "@nestjs/terminus";
import { TerminusOptionsService } from "./health/terminus-options.service";
import { ChatbotModule } from './chatbot/chatbot.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@entity/user.entity";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from './user/user.module';
import { Chatbot } from "@entity/chatbot.entity";
import { AuthModule } from './auth/auth.module';
import { HandlebarsAdapter, MailerModule } from "@nestjs-modules/mailer";
import * as path from "path";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    MailerModule.forRoot({
      transport: {
        host: `${process.env.MAIL_HOST}`,
        port: `${process.env.MAIL_PORT}`,
        secure: true, // true for 465, false for other ports
        auth: {
          user: `${process.env.MAIL_USER}`,
          pass: `${process.env.MAIL_PASSWORD}`
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      },
      defaults: {
        from:`"nest-modules" <${process.env.MAIL_USER}>`,
      },
      template: {
        dir: path.resolve(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ChatbotModule,
    UserModule,
    AuthModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ]
})
export class AppModule {
}
