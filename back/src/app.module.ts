import { Module } from '@nestjs/common';
import { TerminusModule } from "@nestjs/terminus";
import { ChatbotModule } from './chatbot/chatbot.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@entity/user.entity";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from './user/user.module';
import { Chatbot } from "@entity/chatbot.entity";
import { AuthModule } from './auth/auth.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from "path";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { AdminModule } from './admin/admin.module';
import { ScheduleModule } from "@nestjs/schedule";
import { ChatbotUser } from "@entity/chatbot-user.entity";
import { MailerModule } from "@nestjs-modules/mailer";
import { HealthController } from './health/health.controller';
import { BullModule } from "@nestjs/bull";
import { FabriqueConfig } from "@entity/config.entity";
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TerminusModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Chatbot, ChatbotUser, FabriqueConfig],
      synchronize: true,
      extra: process.env.DATABASE_SSL && process.env.DATABASE_SSL === 'true' ? {
        ssl: true,
        rejectUnauthorized: false
      } : {}
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
      template: {
        dir: path.resolve(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ScheduleModule.forRoot(),
    // @ts-ignore
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true
      },
      limiter: {
        max: 1,
        duration: 60*1000
      }
    }),
    ChatbotModule,
    UserModule,
    AuthModule,
    AdminModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  controllers: [HealthController]
})
export class AppModule {
}
