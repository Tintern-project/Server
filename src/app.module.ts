import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ApplicationModule } from './modules/application/application.module';
import { JobModule } from './modules/job/job.module';
import { AppConfig } from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './Auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ApplicationModule,
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
