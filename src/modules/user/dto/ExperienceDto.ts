import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class ExperienceDto {
  @ApiProperty({
    description: 'Job title of the experience',
    example: 'Software Engineer',
  })
  @IsString()
  jobTitle: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Google',
  })
  @IsString()
  company: string;

  @ApiProperty({
    description: 'A short description of the role',
    example: 'Developed scalable backend services',
  })
  @IsString()
  smallDescription: string;

  @ApiProperty({
    description: 'Duration of the experience in months',
    example: 24,
  })
  @IsNumber()
  duration: number;
}
