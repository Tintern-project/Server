import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../../database/schemas/user.schema';
import { UpdateUserDto } from './dto/updateUserDTO';
import { MyProfileDto } from './dto/MyProfileDto';
@Injectable()
export class UserService {
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

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
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async findById(userId: string): Promise<User | null> {
      const userIdObj = new mongoose.Types.ObjectId(userId);
      return this.userModel.findById(userIdObj).exec();
  }
}
