import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './config/app.config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
let cachedApp;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  
  // Get allowed origins from environment variable or use defaults
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3001', 'https://tintern-client.fly.dev'];
  
  console.log('CORS allowed origins:', allowedOrigins);
  
  app.enableCors({
    origin: allowedOrigins,
    methods: process.env.ALLOWED_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix(AppConfig.apiPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API documentation for the project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${AppConfig.apiPrefix}/docs`, app, documentFactory);

    const dir = path.resolve(__dirname, '../uploads');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }

  await app.init();
  const port = process.env.PORT ?? 8080;
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  cachedApp = app;
  console.log(`Application is running on: ${host}:${port}`);
  console.log(`access the API documentation: ${host}:${port}/api/v1/docs`);
}

bootstrap();

export default async (req, res) => {
  if (!cachedApp) {
    await bootstrap();
  }
  return cachedApp.getHttpAdapter().getInstance()(req, res);
};

