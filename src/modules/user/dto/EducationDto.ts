import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class EducationDto {
  @ApiProperty({
    description: 'Education level',
    enum: ['highschool', 'undergrad', 'postgrad', 'phd'],
    example: 'undergrad',
  })
  @IsString()
  educationLevel: string;

  @ApiProperty({
    description: 'Degree earned',
    example: 'BSc Computer Science',
  })
  @IsString()
  degree: string;

  @ApiProperty({
    description: 'Name of the university',
    example: 'MIT',
  })
  @IsString()
  university: string;

  @ApiProperty({
    description: 'Duration of the education (e.g., in years)',
    example: 4,
  })
  @IsNumber()
  duration: number;
}
