import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../../database/schemas/user.schema'
import { DatabaseModule } from 'src/database/database.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule {}