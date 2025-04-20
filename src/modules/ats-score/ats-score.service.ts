import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ATSScore } from 'src/database/schemas/ats-score.schema';
import { CreateATSScoreDto } from './dto/create-ats-score.dto';

@Injectable()
export class ATSScoreService {
  constructor(
    @InjectModel(ATSScore.name) private resumeScoreModel: Model<ATSScore>,
  ) {}

  async create(createATSScoreDto : CreateATSScoreDto): Promise<ATSScore> {
    const createdScore = new this.resumeScoreModel(createATSScoreDto);
    return createdScore.save();
  }

  async findAllByUser(user: any): Promise<ATSScore[]> {
    const userId = user.userId;
    return this.resumeScoreModel.find({ userId }).sort({ scoredAt: -1 }).exec();
  }
}
