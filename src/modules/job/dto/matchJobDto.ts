import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MatchJobDto {
  @ApiProperty({
    description: 'Job description to match against',
    example: 'We are looking for a Python Developer with experience in: - FastAPI and RESTful API development - Machine Learning and NLP - Docker and containerization - Database management (SQL and NoSQL) - Version control with Git - Requirements: - 3+ years of Python development experience - Strong understanding of software architecture - Experience with cloud platforms (AWS/GCP) - Excellent problem-solving skills'
  })
  @IsString()
  jobDescription: string;
}

export class MatchJobResponseDto {
  @ApiProperty({
    description: 'Similarity score between CV and job description',
    example: 81.83
  })
  similarity_score: number;

  @ApiProperty({
    description: 'List of common keywords found in both CV and job description',
    example: [
      "development",
      "experience",
      "learning",
      "api",
      "control",
      "git",
      "skills",
      "cloud",
      "software",
      "management",
      "python",
      "docker",
      "architecture"
    ]
  })
  common_keywords: string[];

  @ApiProperty({
    description: 'Keywords found only in the resume',
    example: ["javascript", "react", "typescript", "nodejs"]
  })
  resume_only_keywords: string[];

  @ApiProperty({
    description: 'Keywords found only in the job description',
    example: ["aws", "gcp", "fastapi", "nlp"]
  })
  job_description_only_keywords: string[];
} 