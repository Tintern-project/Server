import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Job, JobSchema } from '../../database/schemas/job.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Job.name,
            schema: JobSchema
        }]),
    ],
    controllers:[],
    providers:[],
    exports: []
})

export class JobModule {}