// src/modules/chatbot/dto/chat-message.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({ description: 'The text of the user’s message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Optional context identifier (e.g. a job ID)' })
  @IsString()
  @IsOptional()
  context?: string;
}
