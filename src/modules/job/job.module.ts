import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Job, JobSchema } from '../../database/schemas/job.schema'
import { DatabaseModule } from 'src/database/database.module'

@Module({
    imports:[DatabaseModule],
    controllers:[],
    providers:[],
    exports: []
})

export class JobModule {}