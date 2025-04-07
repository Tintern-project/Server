import { ApiProperty } from '@nestjs/swagger';
import { EducationDto } from './EducationDto';

export class ReplaceEducationDto {
  @ApiProperty({ type: EducationDto })
  oldEducation: EducationDto;

  @ApiProperty({ type: EducationDto })
  newEducation: EducationDto;
}
