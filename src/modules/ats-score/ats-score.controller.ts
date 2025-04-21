import { Controller, Post, Body, Get, Query, Delete, UseGuards } from '@nestjs/common';
import { ATSScoreService } from './ats-score.service';
import { CreateATSScoreDto } from './dto/create-ats-score.dto';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';
import { GetUser } from 'src/Auth/decorators/get-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('ats-scores')
export class ATSScoreController {
  constructor(private readonly atsScoreService: ATSScoreService) {}
  
  @Get('my-scores')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all ats scores generated for this user'})
  @ApiResponse({ status: 200, description: 'ATS scores successfully fetched'})
  findAllByUser(@GetUser() user: any) {
    return this.atsScoreService.findAllByUser(user);
  }
}
