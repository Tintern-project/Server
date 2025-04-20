import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from "./schemas/user.schema";
import { Job, JobSchema } from './schemas/job.schema';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { ATSScore, ATSScoreSchema } from './schemas/ats-score.schema';

export const DatabaseModels = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Job.name, schema: JobSchema },
    { name: Application.name, schema: ApplicationSchema },
    { name: ATSScore.name, schema: ATSScoreSchema },
]);