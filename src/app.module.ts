import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ApplicationModule } from './application/application.module';
import { CVModule } from './cv/cv.module';
import { JobModule } from './job/job.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    ApplicationModule,
    CVModule,
    JobModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
