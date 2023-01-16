import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { BotLogger } from "./logger/bot.logger";
import rateLimit from "express-rate-limit";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.useLogger(app.get(BotLogger));
  if(process.env.NODE_ENV === 'prod') {
    app.enableCors({
      origin: process.env.HOST_URL
    });
  } else {
    app.enableCors();
  }
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Fabrique à chatbots')
    .setDescription('The chatbot factory API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'API - Usine à Chatbots'
  });

  await app.listen(3000);
}
bootstrap();
