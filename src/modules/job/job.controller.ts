import { Controller, Post, Get, UseGuards, Param, Body, Patch, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JobService } from './job.service';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';
import { GetUser } from 'src/Auth/decorators/get-user.decorator';
import { FilterCriteriaDto } from './dto/filterCriteriaDto';
import { IS_PUBLIC_KEY, Public } from 'src/Auth/decorators/public.decorator';
import { Role, Roles } from 'src/Auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MatchJobDto, MatchJobResponseDto } from './dto/matchJobDto';

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

  @Delete('save/delete/:jobId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a job from the saved jobs list' })
  @ApiResponse({ status:200, description: 'Job has been successfully removed' })
  @ApiNotFoundResponse({ description: 'Job not found' })
  @ApiBadRequestResponse({ description: 'Job is not saved by this user ' })
  async removeSavedJob(@Param('jobId') id: string, @GetUser() user: any){
    return this.jobService.removeSavedJob(id, user?.userId);
  }

  @Get('ats/:jobId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ats scoring system' })
  @ApiResponse({ status: 200, description: 'Api responded' })
  @ApiNotFoundResponse({ description: 'Job not found' })
  @ApiBadRequestResponse({ description: 'No cv found in user account' })
  async AtsScore(@Param('jobId') jobId: string , @GetUser() user: any ) {
    return this.jobService.getAtsScore(user?.userId || user?._userId, jobId);
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
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unique job filters' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved unique job filters' })
  async getUniqueIndustries() {
    return this.jobService.getAllFilters();
  }

  // Method to filter jobs
  @Post('filter')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Filter jobs' })
  @ApiResponse({ status: 200, description: 'Successfully filtered jobs' })
  async filterJobs(@Body() filterCriteria: FilterCriteriaDto) {
    return this.jobService.filterJobs(filterCriteria);
  }

  @Post('match')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Match user CV with job description' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully matched CV with job description',
    type: MatchJobResponseDto
  })
  @ApiBody({
    type: MatchJobDto,
    description: 'Job description to match against user CV'
  })
  async matchJob(
    @GetUser() user: any,
    @Body() matchJobDto: MatchJobDto,
  ): Promise<MatchJobResponseDto> {
    return this.jobService.matchJob(user?.userId || user?._userId, matchJobDto.jobDescription);
  }

  // Method to get all jobs
  @Get()
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all jobs' })
  async getAllJobs() {
    return this.jobService.getAllJobs();
  } 


  @Get(':jobId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a job by its id'})
  @ApiResponse({ status: 200, description: 'Successfully retrieved job' })
  async getJobById(@Param('jobId') id : string){
    return this.jobService.getJobById(id);
  }
} 