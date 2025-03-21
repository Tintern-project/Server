import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CV, CVSchema } from '../../database/schemas/cv.schema'
import { CVController } from './cv.controller'
import { CVService } from './cv.service'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: CV.name,
            schema: CVSchema
        }]),
    ],
    controllers:[CVController],
    providers:[CVService],
    exports: []
})

export class CVModule {}