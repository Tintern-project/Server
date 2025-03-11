import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ ref: "user", required: true })
  userId: string;

  @Prop({ ref: "job", required: true })
  jobId: string;

  @Prop({ enum: ["submitted", "under review", "accepted", "rejected"], default: "submitted" })
  status: string;

  @Prop({ required: true, ref: "cv" })
  cv : string;

  @Prop()
  atsScore: number;

  readonly _id?: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
