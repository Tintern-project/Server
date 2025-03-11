import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  industry: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  requirements: string;

  @Prop({ type: Date, required: true })
  applicationDeadline: Date;

  @Prop({ ref: "User" })
  applicants: string[];

  @Prop({ ref: "User" })
  savedBy: string[];

  readonly _id?: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
