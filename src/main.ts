import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './config/app.config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

let cachedApp;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser.default());
  
  app.enableCors({
    origin: 'http://localhost:3000',//change to client port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix(AppConfig.apiPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation for the project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${AppConfig.apiPrefix}/docs`, app, documentFactory);

  await app.init();
  await app.listen(process.env.PORT ?? 3000);
  cachedApp = app;
}

bootstrap();

export default async (req, res) => {
  if (!cachedApp) {
    await bootstrap();
  }
  return cachedApp.getHttpAdapter().getInstance()(req, res);
};

