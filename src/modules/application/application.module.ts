import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Application, ApplicationSchema } from '../../database/schemas/application.schema'
import { DatabaseModule } from 'src/database/database.module'

@Module({
    imports:[DatabaseModule],
    controllers:[],
    providers:[],
    exports: []
})

export class ApplicationModule {}