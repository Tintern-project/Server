import { Injectable, InternalServerErrorException,} from '@nestjs/common';

@Injectable()
export class CVService {
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
          // Update or create the CV document for the given user
        //   const updatedCv = await this.cvModel.findOneAndUpdate(
        //     { userId }, // filter criteria (adjust as needed)
        //     { $set: { filePath, updatedAt: new Date() } },
        //     { new: true, upsert: true } // upsert creates a new document if none exists
        // );
    
          // Update the user document with the CV reference (e.g., cvUrl)
        //   const updatedUser = await this.userModel.findByIdAndUpdate(
        //     userId,
        //     { $set: { cvUrl: filePath } },
        //     { new: true }
        //   );
    
          return { success: true, path: filePath};
          //return { success: true, updatedUser, updatedCv };
        } catch (error) {
          throw new InternalServerErrorException('Database update failed');
        }
      }
}
