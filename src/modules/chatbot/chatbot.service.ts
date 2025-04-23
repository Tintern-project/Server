import { Injectable } from '@nestjs/common';
import deepseek from '../../config/deepseek.config';
import { ChatMessageDto } from './dto/chat-message.dto';

@Injectable()
export class ChatbotService {
  private systemPrompt = `
  You are a helpful career assistant for a job platform. Your capabilities include:
  1. Explaining ATS scores and improvement suggestions
  2. Guiding users through job application processes
  3. Answering questions about platform features
  4. Providing career advice based on user's profile

  Always respond in friendly, professional tone. If unsure, ask for clarification.
  You MUST don't response on any unprofessional questions any questions that are not related to finding work or interns or improving the ats you have to strictly 
  refuse to answer them and say "Nagar restricted me, please ask professional Questions"
  `;

  /**
   * Handle an incoming chat message.
   * @param userId - ID of the authenticated user
   * @param chatDto - Parsed DTO containing message and optional context
   */
  async handleMessage(
    userId: string | null,
    chatDto: ChatMessageDto,
  ) {
    try {
      const completion = await deepseek.chat.completions.create({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          { role: 'system', content: this.systemPrompt },
          {
            role: 'user',
            content: this.buildUserPrompt(userId, chatDto),
          },
        ],
        temperature: 0.7,
      });

      return this.processResponse(completion.choices[0].message.content);
    } catch (error) {
      throw new Error(`Chatbot error: ${error.message}`);
    }
  }

  /**
   * Construct the user prompt, including user ID and context
   */
  private buildUserPrompt(userId: string, dto: ChatMessageDto) {
    const context = dto.context ? `Context: ${dto.context}` : 'No specific context';
    return `User (${userId}): ${dto.message}\n${context}`;
  }

  /**
   * Format the raw response into structured output
   */
  private processResponse(rawResponse: string) {
    return {
      message: rawResponse,
      timestamp: new Date().toISOString(),
    };
  }
}
