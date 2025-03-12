import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from "./schemas/user.schema";
import { CV, CVSchema } from './schemas/cv.schema';
import { Job, JobSchema } from './schemas/job.schema';
import { Application, ApplicationSchema } from './schemas/application.schema';

export const DatabaseModels = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: CV.name, schema: CVSchema },
    { name: Job.name, schema: JobSchema },
    { name: Application.name, schema: ApplicationSchema },
]);