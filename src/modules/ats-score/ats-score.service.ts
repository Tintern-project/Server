import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ATSScore } from 'src/database/schemas/ats-score.schema';
import { CreateATSScoreDto } from './dto/create-ats-score.dto';
import { ATSScoreWithJob } from './dto/ats-score-with-job.dto';
import { Job } from 'src/database/schemas/job.schema';

@Injectable()
export class ATSScoreService {
  constructor(
    @InjectModel(ATSScore.name) private atsScoreModel: Model<ATSScore>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
  ) {}

  async create(createATSScoreDto : CreateATSScoreDto): Promise<ATSScore> {
    const createdScore = new this.atsScoreModel(createATSScoreDto);
    return createdScore.save();
  }

  async findAllByUser(user: any): Promise<ATSScoreWithJob[]> {
    const userId = user.userId;
    const scoresListing = await this.atsScoreModel.find({ userId }).sort({ scoredAt: -1 }).exec();
    const jobIds = scoresListing.map(score => score.jobId);
    const jobs = await this.jobModel.find({ _id: { $in: jobIds } }).exec();

    const jobMap = new Map<string, Job>();
    jobs.forEach(job => jobMap.set(job._id.toString(), job));

    const scoresAndJobListing: ATSScoreWithJob[] = scoresListing.map(score => {
      const job = jobMap.get(score.jobId.toString());
      return {
        title: job?.title || 'Unknown Title',
        company: job?.company || 'Unknown Company',
        score,
      };
    });
    return scoresAndJobListing;
  }
}
