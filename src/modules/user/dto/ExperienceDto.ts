import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Matches } from 'class-validator';

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
  description: string;

   @ApiProperty({
      description: 'Start date of the Experience',
      example: '2004-01-01'
    })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date must be in the format YYYY-MM-DD',
    })
    startDate: String;


    @ApiProperty({
      description: 'End date of the Experience',
      example: '2004-01-01'
    })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date must be in the format YYYY-MM-DD',
    })
    endDate: String;
}
