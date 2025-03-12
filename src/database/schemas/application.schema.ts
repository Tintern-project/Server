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

  @Prop({ required: true, ref: "cv" })
  cv : string;

  @Prop()
  atsScore: number;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
