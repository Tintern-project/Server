import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AtsScoreContent {
    @IsNotEmpty()
    @IsNumber()
    ats: number;
  
    @IsNotEmpty()
    @IsString()
    response: string;
  }

export class CreateATSScoreDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  jobId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AtsScoreContent)
  atsScore: AtsScoreContent;
}
