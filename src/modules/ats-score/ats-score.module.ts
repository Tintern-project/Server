import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module'
import { ATSScore , ATSScoreSchema } from '../../database/schemas/ats-score.schema';
import { ATSScoreService } from './ats-score.service';
import { ATSScoreController } from './ats-score.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ATSScoreController],
  providers: [ATSScoreService],
  exports: [ATSScoreService],
})
export class ATSScoreModule {}
