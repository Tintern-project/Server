import { IsEmail, IsEnum, IsString, IsArray, IsUrl, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MyProfileDto {
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'The email of the user', example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The phone number of the user', example: '+1234567890' })
    @IsString()
    phone: string;

    @ApiProperty({ description: 'The URL of the user\'s profile picture', example: 'https://example.com/profile.jpg' })
    @IsUrl()
    profile_picture_url: string;

    @ApiProperty({ description: 'Whether the user has uploaded a CV', example: true })
    @IsBoolean()
    hasCV: boolean;
}
