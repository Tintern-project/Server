import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { JobController } from './job.controller'
import { JobService } from './job.service'

@Module({
    imports:[DatabaseModule],
    controllers:[JobController],
    providers:[JobService],
    exports: [JobService]
})

export class JobModule {}