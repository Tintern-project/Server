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

@Injectable()
export class UserService {
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

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
    const user = this.userModel.findOne({ email:email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
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

  async addExperience(userId: string, newExperience: ExperienceDto) {

    try{

      await this.userModel.findByIdAndUpdate(userId, {$addToSet: {experience: newExperience as unknown as Experience}}, {new: true});

      return {success: true, message: "Experience added successfully"};

    }catch(error){

      throw new InternalServerErrorException('Experience failed to update, please try again!');
    }
  }

  async changeEducation(userId: string, newEducation: EducationDto){

    try{

      await this.userModel.findByIdAndUpdate(userId, {$addToSet: {education: newEducation as unknown as Education}}, {new: true});

      return {success: true, message: "Education added successfully"};

    }catch(error){

      throw new InternalServerErrorException('Education failed to update, please try again!', 'Education level must be : highschool, undergrad, postgrad, or phd.');
    }
  }

  async deleteExperience(userId: string, experience: ExperienceDto){
    
    try {

      await this.userModel.findByIdAndUpdate(userId, {$pull: {experience: experience as unknown as Experience}}, {new: true});

      return {success: true, message: "Education deleted successfully"};

    }catch(error){

      throw new InternalServerErrorException('Education failed to delete, please try again!')
    }
  }

  async deleteEducation(userId: string, education: EducationDto){
    
    try {

      await this.userModel.findByIdAndUpdate(userId, {$pull: {education: education as unknown as Education}}, {new: true});

      return {success: true, message: "Education deleted successfully"};

    }catch(error){

      throw new InternalServerErrorException('Education failed to delete, please try again!')
    }
  }

  async editExperience(userId: string, oldExperience: ExperienceDto, newExperience: ExperienceDto){

    try {

      const pullResult = await this.userModel.findByIdAndUpdate(
        userId,
        { $pull: { experience: oldExperience as unknown as Experience} },
        { new: true }
      ).exec();
    
      if (!pullResult) {
        throw new NotFoundException('User or experience not found during removal');
      }
    
      
      await this.userModel.findByIdAndUpdate(
        userId,
        { $addToSet: { experience: newExperience as unknown as Experience}},
        { new: true }
      ).exec();

      return {success: true, message: "Experience Edited successfully"};

    }catch(error){

      throw new InternalServerErrorException('Experience failed to update, please try again!')
    }
  }

  async editEducation(userId: string, oldEducation: EducationDto, newEducation: EducationDto){

    try {

      const pullResult = await this.userModel.findByIdAndUpdate(
        userId,
        { $pull: { education: oldEducation as unknown as Education} },
        { new: true }
      ).exec();
    
      if (!pullResult) {
        throw new NotFoundException('User or education not found during removal');
      }
    
      await this.userModel.findByIdAndUpdate(
        userId,
        { $addToSet: { education: newEducation as unknown as Education} },
        { new: true }
      ).exec();

      return {success: true, message: "Education Edited successfully"};

    }catch(error){

      throw new InternalServerErrorException('Education failed to update, please try again!')
    }
  }
}
