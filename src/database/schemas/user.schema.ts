import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

export class Experience{

  @IsString()
  @Prop({required: true})
  jobTitle: string;

  @IsString()
  @Prop({required: true})
  company: string;

  @IsString()
  @Prop({required: true})
  smallDescription: string;

  @IsNumber()
  @Prop({required: true})
  duration: Number;

  @IsDate()
  @Prop()
  startDate: Date;

  @IsDate()
  @Prop()
  endDate: Date;
}

export class Education{

  @Prop({required: true, enum: ['highschool','undergrad', 'postgrad', 'phd'] })
  @IsString()
  educationLevel: string;

  @Prop({required: true})
  @IsString()
  degree: string;

  @Prop({required: true})
  @IsString()
  university: string;

  @IsNumber()
  @Prop()
  duration: Number;

  @IsDate()
  @Prop()
  startDate: Date;

  @IsDate()
  @Prop()
  endDate: Date;
}
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

  @Prop({ required: true})
  education: Education[];  

  @Prop({ required: false })
  experience: Experience[];

  @Prop({ ref: "Application" })
  applications: string[];

  @Prop({ ref: "Job" })
  savedJobs: string[];

  @Prop({ required: false, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'})
  profile_picture_url: string;
}

export const UserSchema = SchemaFactory.createForClass(User);