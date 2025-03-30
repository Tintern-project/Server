import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FilterCriteriaDto {
  @ApiProperty({ description: 'Keyword to search in job title or company', example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiProperty({ description: 'Location of the job', example: 'New York' })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({ description: 'Role of the job', example: 'Full Stack Developer' })
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty({ description: 'Industry of the job', example: 'Information Technology' })
  @IsString()
  @IsOptional()
  industry: string;
}