import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type CVDocument = CV & Document;

@Schema({ timestamps: true })
export class CV {
  @Prop({ref: "User", required: true })
  userId: string;

  @Prop({ required: true })
  fileUrl: string; // Store the file path or cloud storage URL

  @Prop()
  parsedText?: string; // Extracted text from the CV for ATS scoring

  @Prop()
  skills?: string[]; // Extracted skills

  @Prop()
  education?: string[]; // Extracted education details

  @Prop()
  experience?: string[]; // Extracted work experience

  @Prop()
  atsScore?: number; // Last calculated ATS score for a job

  readonly _id?: string;
}

export const CVSchema = SchemaFactory.createForClass(CV);
