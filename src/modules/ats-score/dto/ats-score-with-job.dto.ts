import { ATSScore } from "src/database/schemas/ats-score.schema";

export interface ATSScoreWithJob{
    title: string;
    company: string;
    score: ATSScore;
}