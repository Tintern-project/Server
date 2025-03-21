import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ApplicationModule } from './modules/application/application.module';
import { CVModule } from './modules/cv/cv.module';
import { JobModule } from './modules/job/job.module';
import { AppConfig } from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { CVController } from './modules/cv/cv.controller';
import { CVService } from './modules/cv/cv.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    ApplicationModule,
    CVModule,
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
