import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Application, ApplicationSchema } from '../../database/schemas/application.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Application.name,
            schema: ApplicationSchema
        }]),
    ],
    controllers:[],
    providers:[],
    exports: []
})

export class ApplicationModule {}