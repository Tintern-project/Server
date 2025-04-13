import { Controller, Get, Put, Body, UseGuards, Post, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiNotFoundResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/Auth/decorators/get-user.decorator';
import {diskStorage} from 'multer';
import { ExperienceDto } from './dto/ExperienceDto';
import { EducationDto } from './dto/EducationDto';
import { ReplaceExperienceDto } from './dto/ReplaceExperienceDto';
import { ReplaceEducationDto } from './dto/ReplaceEducationDto';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('my-profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Updates the profile of the currently authenticated user' })
  @ApiResponse({ status: 200, description: 'The profile has been successfully updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateUser(@GetUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(user?.userId || user?._userId, updateUserDto);
  }

  @Get('my-profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the profile of the currently authenticated user' })
  @ApiResponse({ status: 200, description: 'The profile has been successfully retrieved' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getMyProfile(@GetUser() user: any) {
    return await this.userService.getMyProfile(user?.userId || user?._userId);
  }

  @Post('resume')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'PDF file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF file to upload',
        },
      },
    },
  })
  
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Using process.cwd() ensures the folder is relative to where the app is started.
          const uploadPath = 'uploads';
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Create a unique filename using a timestamp
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  uploadPdf(@UploadedFile() file: Express.Multer.File, @GetUser() user: any) {
    return this.userService.uploadAndUpdate(file, user?.userId || user?._userId);
  }

  @Get('experience')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the experience of the user' })
  @ApiResponse({ status: 200, description: 'The experience has been successfully retrieved' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getExperience(@GetUser() user: any) {
    return await this.userService.getExperience(user?.userId || user?._userId);
  }

  @Get('education')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the education of the user' })
  @ApiResponse({ status: 200, description: 'The education has been successfully retrieved' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getEducation(@GetUser() user: any) {
    return await this.userService.getEducation(user?.userId || user?._userId);
  }

  @Post('experience')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add an experience to a user if it does not already exist' })
  @ApiBody({ type: ExperienceDto })
  addExperience(@GetUser() user: any, @Body() experienceDto : ExperienceDto){
    return this.userService.addExperience(user.userId, experienceDto as any);
  }

  @Post('education')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add an education record to a user if it does not already exist' })
  @ApiBody({ type: EducationDto })
  changeEducation(@GetUser() user: any, @Body() educationDto: EducationDto){
    return this.userService.changeEducation(user.userId, educationDto as any);
  }

  @Delete('experience')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete an experience of a user if it exists' })
  @ApiBody({ type: ExperienceDto })
  deleteExperience(@GetUser() user: any, @Body() experienceDto: ExperienceDto){
    return this.userService.deleteExperience(user.userId, experienceDto as any);
  }

  @Delete('education')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete an education of a user if it exists' })
  @ApiBody({ type: EducationDto })
  deleteEducation(@GetUser() user: any, @Body() educationDto: EducationDto){
    return this.userService.deleteEducation(user.userId, educationDto as any);
  }

  @Put('experience')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit an experience of a user if it exists' })
  @ApiBody({ type: ReplaceExperienceDto })
  editExperience(@GetUser() user: any, @Body() replaceExperienceDto: ReplaceExperienceDto){

    return this.userService.editExperience(user.userId, replaceExperienceDto.oldExperience, replaceExperienceDto.newExperience);
  }

  @Put('education')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit an education of a user if it exists' })
  @ApiBody({ type: ReplaceEducationDto })
  editEducation(@GetUser() user: any, @Body() replaceEducationDto: ReplaceEducationDto){

    return this.userService.editEducation(user.userId, replaceEducationDto.oldEducation, replaceEducationDto.newEducation);
  }
}

