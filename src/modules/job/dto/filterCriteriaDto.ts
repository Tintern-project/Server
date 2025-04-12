import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FilterCriteriaDto {
  @ApiProperty({ description: 'Keyword to search in job title or company', example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiProperty({ description: 'Country of the job', example: 'Egypt' })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ description: 'City of the job', example: 'Cairo' })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ description: 'Role of the job', example: 'Full-time' })
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty({ description: 'Industry of the job', example: 'Information Technology' })
  @IsString()
  @IsOptional()
  industry: string;

  @ApiProperty({ description: 'Type of the job', example: 'On-site' })
  @IsString()
  @IsOptional()
  type: string;
}