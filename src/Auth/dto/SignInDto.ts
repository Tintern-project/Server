import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsEmail, IsUrl, IsOptional, MinLength  } from 'class-validator';

export class SignInDto {
    @ApiProperty({ description: 'The email address of the user', example: 'john.doe@example.com' })
    @IsEmail()
    email: string;
    
    @ApiProperty({ description: 'The password of the user', example: 'strongPassword123' })
    @IsString()
    password: string;
  }