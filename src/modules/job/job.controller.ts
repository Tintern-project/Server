import { Controller, Post, Get, UseGuards, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { JobService } from './job.service';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';
import { GetUser } from 'src/Auth/decorators/get-user.decorator';
import { FilterCriteriaDto } from './dto/filterCriteriaDto';

@UseGuards(AuthGuard)
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('save/:jobId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save a job for the current user' })
  @ApiResponse({ status: 200, description: 'Job has been successfully saved' })
  @ApiNotFoundResponse({ description: 'Job not found' })
  async saveJob(@Param('jobId') jobId: string, @GetUser() user: any) {
    return this.jobService.saveJob(jobId, user?.userId || user?._userId);
  }

  @Get('saved')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all saved jobs for the current user' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved saved jobs' })
  async getSavedJobs(@GetUser() user: any) {
    return this.jobService.getSavedJobs(user?.userId || user?._userId);
  }

  // Method to get unique job filters
  @Get('unique-filters')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unique job filters' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved unique job filters' })
  async getUniqueIndustries() {
    return this.jobService.getAllFilters();
  }

  // Method to filter jobs
  @Post('filter')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Filter jobs' })
  @ApiResponse({ status: 200, description: 'Successfully filtered jobs' })
  async filterJobs(@Body() filterCriteria: FilterCriteriaDto) {
    return this.jobService.filterJobs(filterCriteria);
  }

  // Method to get all jobs
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all jobs' })
  async getAllJobs() {
    return this.jobService.getAllJobs();
  } 
} 