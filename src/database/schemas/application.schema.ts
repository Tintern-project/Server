import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class Application extends Document{
  @Prop({ ref: "user", required: true })
  userId: string;

  @Prop({ ref: "job", required: true })
  jobId: string;

  @Prop({ enum: ["submitted", "under review", "accepted", "rejected"], default: "submitted" })
  status: string;

  @Prop()
  atsScore: number;
 
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

//Unique index to enforce checks and avoid race conditions in findOne
ApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
