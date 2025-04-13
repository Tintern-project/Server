import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsEmail, IsUrl, IsOptional, MinLength  } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsString()
    name: string;
  
    @ApiProperty({ description: 'The email address of the user', example: 'john.doe@example.com' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ description: 'The phone number of the user', example: '+1234567890' })
    @IsString()
    phone: string;
  
    @ApiProperty({ description: 'The password of the user', example: 'strongPassword123' })
    @IsString()
    @MinLength(8)
    password: string;
  
    @ApiProperty({ 
      description: 'Education level of the user', 
      enum: ['highschool', 'undergrad', 'postgrad', 'phd'],
      example: 'undergrad'
    })
    @IsString()
    educationLevel: string;
}