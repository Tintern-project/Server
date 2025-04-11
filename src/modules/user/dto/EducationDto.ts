import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, Matches } from 'class-validator';

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

  @ApiProperty({
    description: 'Start date of the Education',
    example: '2004-01-01'
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  @Transform(({ value }) => new Date(value))
  startDate: Date;


  @ApiProperty({
    description: 'End date of the Education',
    example: '2004-01-01'
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  @Transform(({ value }) => new Date(value))
  endDate: Date;

}
