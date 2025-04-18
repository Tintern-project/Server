import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Application } from "src/database/schemas/application.schema";
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ApplicationService {
  
  constructor(
    @InjectModel(Application.name) private readonly applicationModel: Model<Application>,
  ) {}

  async apply(userId: string, jobId: string){

    try {

        const alreadyApplied = await this.applicationModel.findOne({userId, jobId});

        if(alreadyApplied)
            throw new ConflictException('You have already applied for this job');

        await this.applicationModel.create({userId, jobId});

        return {success: true, message: "Application added successfully"};

    }catch(error){
        throw new InternalServerErrorException(error.message)
    }
  }

  async getApplications(userId: string){
    
    try{

        const applications = await this.applicationModel.find({userId}).exec();
        
        return {success: true, data: applications}

    }catch(error){
        throw new InternalServerErrorException(error.message)
    }
  }
}