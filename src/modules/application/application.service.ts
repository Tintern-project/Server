import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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

  async getApplicationStatus(userId: string, jobId: string){
    const result = await this.applicationModel.findOne({userId, jobId});
    return result?.status || 'not applied';
  }

  async changeApplicationStatus(jobId: string, userId: string, status: string) {
    const validStatuses = ['submitted', 'rejected', 'accepted', 'under review'];
  
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const application = await this.applicationModel.findOne({ jobId, userId });
    if (!application) {
      throw new NotFoundException('No application submitted by the user for this job');
    }
  
    application.status = status;
    return await application.save();
  }
  
}