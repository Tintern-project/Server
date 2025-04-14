import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Matches, IsOptional } from 'class-validator';

export class updateExperienceDto {
  @ApiProperty({
    description: 'Job title of the experience',
    example: 'Software Engineer',
  })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Google',
  })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({
    description: 'A short description of the role',
    example: 'Developed scalable backend services',
  })
  @IsString()
  @IsOptional()
  smallDescription?: string;

  @ApiProperty({
    description: 'Duration of the experience in months',
    example: 24,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

   @ApiProperty({
      description: 'Start date of the Experience',
      example: '2004-01-01'
    })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date must be in the format YYYY-MM-DD',
    })
    @IsOptional()
    startDate?: String;


    @ApiProperty({
      description: 'End date of the Experience',
      example: '2004-01-01'
    })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date must be in the format YYYY-MM-DD',
    })
    @IsOptional()
    endDate?: String;
}
