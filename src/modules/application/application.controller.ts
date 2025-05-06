import { Body, Controller, Get, Post, UseGuards, Param, Patch } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { AuthGuard } from "src/Auth/guards/authentication.guard";
import { GetUser } from "src/Auth/decorators/get-user.decorator";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Application } from "src/database/schemas/application.schema";
import { ResponseDto } from "./dto/responseDto";

@UseGuards(AuthGuard)
@Controller('application')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {}

    @Post()
    @ApiBearerAuth()
    @ApiBody({schema: {
        properties: {
            jobId: { type: 'string' }
        },
        required: ['jobId']
    }})
    @ApiOperation({summary: 'Apply for a new job with the logged in user'})
    async apply(@GetUser() user: any, @Body('jobId') jobId: string){
        return this.applicationService.apply(user.userId, jobId);
    }

    @Get()
    @ApiBearerAuth()
    @ApiOkResponse({type: ResponseDto})
    async getApplications(@GetUser() user: any){
        return await this.applicationService.getApplications(user.userId);
    }

    @Get(':jobId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retreive the status of the job application'})
    @ApiOkResponse({ description: 'Application status successfully retrieved'})
    async getApplicationStatus(@GetUser() user: any, @Param('jobId') jobId: string): Promise<string>{
        return await this.applicationService.getApplicationStatus(user?.userId, jobId);
    }

    @Patch(':jobId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update the status of the job application'})
    @ApiOkResponse({ description: 'Application status successfully updated'})
    @ApiBadRequestResponse({ description: 'Invalid Status'})
    @ApiNotFoundResponse({ description: 'No application submitted by the user for this job'})
    async changeApplicationStatus(@Param('jobId') jobId: string,@GetUser() user: any, @Body('status') status: string): Promise<Application>{
        return await this.applicationService.changeApplicationStatus(jobId, user?.userId, status);
    }

}