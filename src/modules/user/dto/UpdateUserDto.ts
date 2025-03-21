import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsEmail, IsUrl, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'The email address of the user', example: 'john.doe@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'The phone number of the user', example: '+1234567890' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ description: 'The URL of the user\'s profile picture', example: 'https://example.com/profile.jpg' })
    @IsUrl()
    @IsOptional()
    profile_picture_url?: string;
}
