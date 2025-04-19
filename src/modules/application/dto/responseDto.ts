import { ApiProperty } from '@nestjs/swagger';
import { Application } from 'src/database/schemas/application.schema';

export class ResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ type: [Application] })
  data: Application[];
}