import { Module } from '@nestjs/common';
import { ATSScoreService } from './ats-score.service';
import { ATSScoreController } from './ats-score.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ATSScoreController],
  providers: [ATSScoreService],
  exports: [ATSScoreService],
})
export class ATSScoreModule {}
