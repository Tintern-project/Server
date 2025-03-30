import { ApiProperty } from '@nestjs/swagger';
import { EducationDto } from './EducationDto';

export class AddEducationDto {
  @ApiProperty({
    description: 'The education object to add to the user',
    type: EducationDto,
  })
  education: EducationDto;
}
