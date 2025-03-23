import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CVService } from './cv.service';
import {diskStorage} from 'multer';
import { join } from 'path';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { authorizationGuard } from 'src/auth/guards/authorization.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('upload')
@Controller('upload')
export class CVController {
  constructor(private readonly cvService: CVService) {}

  @Post('resume')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
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
    return this.cvService.uploadAndUpdate(file, user?.id || user?._id);
  }

  
}
