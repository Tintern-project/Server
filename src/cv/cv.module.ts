import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CV, CVSchema } from './model/cv.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: CV.name,
            schema: CVSchema
        }]),
    ],
    controllers:[],
    providers:[],
    exports: []
})

export class CVModule {}