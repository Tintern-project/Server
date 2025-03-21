import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CVController } from './cv.controller'
import { CVService } from './cv.service'
import { User, UserSchema } from 'src/database/schemas/user.schema'

@Module({
    imports:[
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
          ]),
    ],
    controllers:[CVController],
    providers:[CVService],
    exports: []
})

export class CVModule {}