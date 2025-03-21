import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Job extends Document{
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
}

export const JobSchema = SchemaFactory.createForClass(Job);
