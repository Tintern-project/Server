import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

@Schema({_id: true, id: true})
export class Experience{

  @IsString()
  @Prop({required: true})
  jobTitle: string;

  @IsString()
  @Prop({required: true})
  company: string;

  @IsString()
  @Prop({required: true})
  description: string;

  @IsString()
  @Prop(
    {
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format! Required: YYYY-MM-DD`
    }
   }
  )
  startDate: string;

  @IsString()
  @Prop(
    {
      required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format! Required: YYYY-MM-DD`
    }
   }
  )
  endDate: string;
}

@Schema({_id: true, id: true})
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

  @IsString()
  @Prop(
    {
      required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format! Required: YYYY-MM-DD`
    }
   }
  )
  startDate: string;

  @IsString()
  @Prop(
    {
      required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format! Required: YYYY-MM-DD`
    }
   }
  )
  endDate: string;
}

export const EducationSchema = SchemaFactory.createForClass(Education);
export const ExperienceSchema = SchemaFactory.createForClass(Experience);

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

  @Prop({ required: false, type: [EducationSchema], default: []})
  education: Education[];  

  @Prop({ required: false, type: [ExperienceSchema], default: []})
  experience: Experience[];

  @Prop({ ref: "Job" })
  savedJobs: string[];

  @Prop({ required: false, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'})
  profile_picture_url: string;
}

export const UserSchema = SchemaFactory.createForClass(User);