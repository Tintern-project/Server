import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ATSScore extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  jobId: string;

  @Prop({
    type: {
      ats: { type: Number, required: true },
      response: { type: String, required: true },
    },
  })
  atsScore: {
    ats: number;
    response: string;
  };

  @Prop({ default: Date.now })
  scoredAt: Date;
}

export const ATSScoreSchema = SchemaFactory.createForClass(ATSScore);
