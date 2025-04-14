import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Matches, IsOptional } from 'class-validator';

export class updateEducationDto {
  @ApiProperty({
    description: 'Education level',
    enum: ['highschool', 'undergrad', 'postgrad', 'phd'],
    example: 'undergrad',
  })
  @IsString()
  @IsOptional()
  educationLevel?: string;

  @ApiProperty({
    description: 'Degree earned',
    example: 'BSc Computer Science',
  })
  @IsString()
  @IsOptional()
  degree?: string;

  @ApiProperty({
    description: 'Name of the university',
    example: 'MIT',
  })
  @IsString()
  @IsOptional()
  university?: string;

  @ApiProperty({
    description: 'Duration of the education (e.g., in years)',
    example: 4,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'Start date of the Education',
    example: '2004-01-01'
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  @IsOptional()
  startDate?: String;


  @ApiProperty({
    description: 'End date of the Education',
    example: '2004-01-01'
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
  @IsOptional()
  endDate?: String;

}
