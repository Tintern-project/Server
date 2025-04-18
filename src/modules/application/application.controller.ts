import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { AuthGuard } from "src/Auth/guards/authentication.guard";
import { GetUser } from "src/Auth/decorators/get-user.decorator";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
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

}