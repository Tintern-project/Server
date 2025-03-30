import { Controller, Get, Put, Body, UseGuards, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiNotFoundResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/Auth/decorators/get-user.decorator';
import {diskStorage} from 'multer';
import { Education, Experience } from 'src/database/schemas/user.schema';
import { AddExperienceDto } from './dto/AddExperienceDto';
import { AddEducationDto } from './dto/AddEducationDto';


enum EDUCATION_LEVELS {
  Highscool = 'highschool',
  Undergrad = 'undergrad',
  Postgrad = 'postgrad',
  PHD = 'phd'
}

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

  @Post('experience')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add an experience to a user if it does not already exist' })
  @ApiBody({ type: AddExperienceDto })
  addExperience(@GetUser() user: any, @Body('experience') addExperienceDto : AddExperienceDto){
    return this.userService.addExperience(user.userId, addExperienceDto as any);
  }

  @Post('education')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add an education record to a user if it does not already exist' })
  @ApiBody({ type: AddEducationDto })
  changeEducation(@GetUser() user: any, @Body('education') addEducationDto: AddEducationDto){
    return this.userService.changeEducation(user.userId, addEducationDto as any);
  }
}

