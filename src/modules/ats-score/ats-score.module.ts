import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ATSScore , ATSScoreSchema } from '../../database/schemas/ats-score.schema';
import { ATSScoreService } from './ats-score.service';
import { ATSScoreController } from './ats-score.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: ATSScore.name, schema: ATSScoreSchema }])],
  controllers: [ATSScoreController],
  providers: [ATSScoreService],
  exports: [ATSScoreService],
})
export class ATSScoreModule {}
