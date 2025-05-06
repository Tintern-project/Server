import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Education, Experience, User } from '../../database/schemas/user.schema';
import { UpdateUserDto } from './dto/updateUserDTO';
import { MyProfileDto } from './dto/MyProfileDto';
import { CreateUserDto } from './dto/CreateUserDto';
import { unlink } from 'fs/promises';
import { EducationDto } from './dto/EducationDto';
import { ExperienceDto } from './dto/ExperienceDto';
import { updateExperienceDto } from './dto/updateExperienceDto';
import { updateEducationDto } from './dto/updateEducationDto';
import { cloudinary } from '../../cloudinary.config';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  // Method to create a user
  async create(user: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  // Method to update a user by ID
  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<MyProfileDto> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const myProfile: MyProfileDto = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile_picture_url: user.profile_picture_url,
      hasCV: user.cv ? true : false,
    };
    return myProfile;
  }

  // Method to get user profile by ID
  async getMyProfile(userId: string): Promise<MyProfileDto> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const myProfile: MyProfileDto = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile_picture_url: user.profile_picture_url,
      hasCV: user.cv ? true : false,
    };
    return myProfile;
  }


  // Update a user's details (generic)
  async update(user: User): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(user._id, user, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${user._id} not found`);
    }
    return updatedUser;
  }

  async findById(userId: string): Promise<User> {
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const user = await this.userModel.findById(userIdObj).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // find by email
  async findByEmail(email: string): Promise<User> {
    const user = this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async uploadAndUpdate(file: Express.Multer.File, userId: string): Promise<any> {

    try {
      // Generate a custom file name, e.g., using UUID and timestamp
      const customFileName = `${uuidv4()}-${Date.now()}-${file.originalname}`;
      // Create a readable stream from the file buffer
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);  // The file buffer stored in memory
      bufferStream.push(null);  // End the stream

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `cvs`,
            public_id: customFileName,      // Use the custom file name as public_id
            resource_type: 'raw',
          },
          (error, result) => {
            if (error) {
              return reject(new Error(`Failed to upload file: ${error}`));
            }

            resolve({
              message: 'Upload successful',
              url: result.secure_url,  // Cloudinary's secure URL for the uploaded file
            });

          }
        );

        bufferStream.pipe(uploadStream);
      });

      const fileUrl = await (uploadResult as any).url;

      const user = await this.userModel.findById(userId).select('cv');

      let publicId = '';
      if (user.cv) {
        const match = user.cv.match(/\/cvs\/([^?/#]+?)(?:\.[a-z]+)?(?:\?.*)?$/i);
        publicId = match ? `cvs/${match[1]}.pdf` : '';
      }


      await this.userModel.findByIdAndUpdate(userId, { cv: fileUrl }, { new: true });

      if (publicId) {

        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: 'raw',
          });
        } catch (error) {
          console.warn('Failed to delete old file from Cloudinary:', error.message);
        }
      }

      return {
        message: 'Upload successful',
        url: fileUrl,  // Returning the URL for the response
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

  }

  async addExperience(userId: string, newExperience: ExperienceDto) {

    try {

      await this.userModel.findByIdAndUpdate(userId, { $addToSet: { experience: newExperience as unknown as Experience } }, { new: true });

      return { success: true, message: "Experience added successfully" };

    } catch (error) {

      throw new InternalServerErrorException('Experience failed to update, please try again!');
    }
  }

  async changeEducation(userId: string, newEducation: EducationDto) {

    try {

      await this.userModel.findByIdAndUpdate(userId, { $addToSet: { education: newEducation as unknown as Education } }, { new: true });

      return { success: true, message: "Education added successfully" };

    } catch (error) {

      throw new InternalServerErrorException('Education failed to update, please try again!', 'Education level must be : highschool, undergrad, postgrad, or phd.');
    }
  }

  async deleteExperience(userId: string, ID: String) {

    try {

      await this.userModel.findByIdAndUpdate(userId, { $pull: { experience: { _id: ID } } }, { new: true });

      return { success: true, message: "Experience deleted successfully" };

    } catch (error) {

      throw new InternalServerErrorException('Experience failed to delete, please try again!')
    }
  }

  async deleteEducation(userId: string, ID: String) {

    try {

      await this.userModel.findByIdAndUpdate(userId, { $pull: { education: { _id: ID } } }, { new: true });

      return { success: true, message: "Education deleted successfully" };

    } catch (error) {

      throw new InternalServerErrorException('Education failed to delete, please try again!')
    }
  }

  async editExperience(userId: string, oldExperienceID: String, newExperience: updateExperienceDto) {

    try {

      const user = await this.userModel.findById(userId);

      const oldExperience = (user.experience as any).find(exp => exp._id.toString() === oldExperienceID);

      Object.assign(oldExperience, newExperience);

      await user.save();

      return { success: true, message: "Experience Edited successfully" };

    } catch (error) {

      throw new InternalServerErrorException('Experience failed to update, please try again!')
    }
  }

  async editEducation(userId: string, oldEducationID: String, newEducation: updateEducationDto) {

    try {

      const user = await this.userModel.findById(userId);

      const oldEducation = (user.education as any).find(edu => edu._id.toString() === oldEducationID);

      Object.assign(oldEducation, newEducation);

      await user.save();

      return { success: true, message: "Education Edited successfully" };

    } catch (error) {

      throw new InternalServerErrorException('Education failed to update, please try again!')
    }
  }

  async getExperience(userId: string): Promise<Experience[]> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.experience;
  }

  async getEducation(userId: string): Promise<Education[]> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.education;
  }

  // get cv 
  async getCV(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.cv;
  }
}
