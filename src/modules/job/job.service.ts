import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from 'src/database/schemas/job.schema';
import { FilterCriteriaDto } from './dto/filterCriteriaDto';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
  ) {}

  async saveJob(jobId: string, userId: string) {
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check if job is already saved
    if (job.savedBy.includes(userId)) {
      return job;
    }

    // Add user to savedBy array
    job.savedBy.push(userId);
    return job.save();
  }

  async getSavedJobs(userId: string) {
    return this.jobModel.find({ savedBy: userId });
  }

  async getAllJobs() {
    return await this.jobModel.find().select('title company country city role industry type');
  }  

  async filterJobs(filterCriteria: FilterCriteriaDto) {
    const { keyword, country, city, role, industry, type } = filterCriteria;
    const query = {};

    if (keyword && keyword.trim() !== '') {
      query['$or'] = [
        { title: new RegExp(keyword, 'i') },
        { company: new RegExp(keyword, 'i') },
      ];
    }

    if (country && country.trim() !== '') {
      query['country'] = new RegExp(country, 'i');
    }

    if (city && city.trim() !== '') {
      query['city'] = new RegExp(city, 'i');
    }

    if (role && role.trim() !== '') {
      query['role'] = new RegExp(role, 'i');
    }

    if (industry && industry.trim() !== '') {
      query['industry'] = new RegExp(industry, 'i');
    }


    if (type && type.trim() !== '') {
      query['type'] = new RegExp(type, 'i');
    }

    return await this.jobModel.find(query).select('title company country city role industry type');
  }

  // Method to return all filters
  async getAllFilters() {
    const industries = await this.jobModel.distinct('industry');
    const countries = await this.jobModel.distinct('country');
    const cities = await this.jobModel.distinct('city');
    return { industries, countries, cities};
  }
} 