import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'

@Module({
    imports:[DatabaseModule],
    controllers:[ApplicationController],
    providers:[ApplicationService],
    exports: [ApplicationService]
})

export class ApplicationModule {}