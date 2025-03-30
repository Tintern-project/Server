import { ApiProperty } from '@nestjs/swagger';
import { ExperienceDto } from './ExperienceDto';

export class AddExperienceDto {
  @ApiProperty({
    description: 'The experience to add to the user',
    type: ExperienceDto,
  })
  experience: ExperienceDto;
}
