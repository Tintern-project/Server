import { Controller, Get, Put, Body, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('my-profile/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Updates the profile of the currently authenticated user' })
  @ApiResponse({ status: 200, description: 'The profile of the currently authenticated user has been updated' })
  @ApiResponse({ status: 404, description: 'Error in data' })
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(userId, updateUserDto);
  };

  @Get('my-profile/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the profile of the currently authenticated user' })
  @ApiResponse({ status: 200, description: 'The profile of the currently authenticated user' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getMyProfile(@Param('userId') userId: string) {
    return await this.userService.getMyProfile(userId);
  }


}
