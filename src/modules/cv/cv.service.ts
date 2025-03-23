import { Injectable, InternalServerErrorException,} from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'
import { User, UserDocument, UserSchema } from '../../database/schemas/user.schema'
import { unlink } from 'fs/promises';
import { error } from 'console';

@Injectable()
export class CVService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
      async uploadAndUpdate(file: Express.Multer.File, userId: string): Promise<any> {
        if (!file) {
          throw new InternalServerErrorException('No file uploaded');
        }
    
        // file.path is provided by diskStorage
        const filePath = file.path;
        if (!filePath) {
          throw new InternalServerErrorException('File path is undefined');
        }
    
        try {
    
          const user = await this.userModel.findById(userId);
          const oldPath = user.cv;
          //Update the user document with the CV reference (e.g., cvUrl)
          const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { $set: { cv: filePath } },
            { new: true }
          );
          await unlink(oldPath).catch((error) => {
            console.error('No old cv');
            return { success: true, path: filePath};
          });
          return { success: true, path: filePath};
        } catch (error) {
          throw new InternalServerErrorException('Database update failed');
        }
      }
}
