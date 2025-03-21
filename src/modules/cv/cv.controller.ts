import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CVService } from './cv.service';
import {diskStorage} from 'multer';
import { join } from 'path';

@Controller('upload')
export class CVController {
  constructor(private readonly cvService: CVService) {}

  @Post('resume')
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
  uploadPdf(@UploadedFile() file: any) {
    return this.cvService.uploadAndUpdate(file, '67dde13fffaa6c14a2f934eb');
  }

  
}
