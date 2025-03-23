import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User extends Document{
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop({ required: false })
  cv: string;

  @Prop({ required: true, enum: ['highschool','undergrad', 'postgrad', 'phd'] })
  educationLevel: string;  

  @Prop({ required: false })
  experience: string;

  @Prop({ ref: "Application" })
  applications: string[];

  @Prop({ ref: "Job" })
  savedJobs: string[];

  @Prop({ required: false, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'})
  profile_picture_url: string;
}

export const UserSchema = SchemaFactory.createForClass(User);