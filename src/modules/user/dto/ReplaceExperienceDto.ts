import { ApiProperty } from '@nestjs/swagger';
import { ExperienceDto } from './ExperienceDto';

export class ReplaceExperienceDto {
  @ApiProperty({ type: ExperienceDto })
  oldExperience: ExperienceDto;

  @ApiProperty({ type: ExperienceDto })
  newExperience: ExperienceDto;
}
