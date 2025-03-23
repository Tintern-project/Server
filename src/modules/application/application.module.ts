import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'

@Module({
    imports:[DatabaseModule],
    controllers:[],
    providers:[],
    exports: []
})

export class ApplicationModule {}