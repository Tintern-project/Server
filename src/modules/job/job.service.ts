import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from 'src/database/schemas/job.schema';
import { FilterCriteriaDto } from './dto/filterCriteriaDto';
import deepseek from '../../config/deepseek.config'; // Adjust the import path as necessary
import * as pdfParse from 'pdf-parse';
import * as fs from 'fs';
import { UserService } from '../user/user.service';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    private readonly userService: UserService,
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

  // Remove job from saved jobs list
  async removeSavedJob(jobId: string, userId: string) {
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
  
    const index = job.savedBy.indexOf(userId);
    if (index === -1) {
      throw new BadRequestException('Job is not saved by this user');
    }
  
    job.savedBy.splice(index, 1);
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

  // Get job by ID
  async getJobById(id : string){
    return await this.jobModel.findById(id).select('-_id -savedBy');
  }

  // get ats score
  async getAtsScore(user: any, jobId: string) {   
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    } 

    // Step 1: Load the PDF file
    const cvFilePath = await this.userService.getCV(user); // assuming this is the file path
    if (!cvFilePath) {
      throw new BadRequestException('CV file not found for the user');
    }
    const cvBuffer = fs.readFileSync(cvFilePath);

    // Step 2: Extract text from the PDF
    const cvData = await pdfParse(cvBuffer);
    const extractedCVText = cvData.text;

    const systemPrompt = `
    You are an ATS (Applicant Tracking System) evaluation assistant for a job website. 

    Your job is to:
    1. Estimate the match between a candidate's resume and a job description with a score from 0 to 100. You must always return a number even if you are uncertain, dont be too harsh in the scoring and dont focus too much on any unmentioned skills or similar skills, but focus on the skills in the job description that should be in the resume.
    2. Give an honest, direct description of what the resume is missing like what keywords are missing or should improve to match the job description. Do not compliment the candidate.
    3. Return the response strictly in this JSON format without any additional text just start with { and end with }:

    {
    ats: [NUMBER],
    response: "[SUGGESTIONS]"
    }
    `;

    const userPrompt = `
    Resume: ${extractedCVText}

    Job Description: ${job.requirements}
    `;
    
    const completion = await deepseek.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content: systemPrompt.trim(),
        },
        {
          role: "user",
          content: userPrompt.trim(),
        },
      ]
    });

    const rawResponse = completion.choices[0].message.content;

    try {
      // Parse the raw response as JSON
      const parsed = JSON.parse(rawResponse);
      return parsed;
    } catch (error) {
      throw new Error("AI response is not valid JSON: " + rawResponse);
    }
  }
}
