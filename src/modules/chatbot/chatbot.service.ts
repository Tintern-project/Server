// src/modules/chatbot/chatbot.service.ts
import { Injectable } from '@nestjs/common';
import deepseek from '../../config/deepseek.config';
import { ChatMessageDto } from './dto/chat-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from '../../database/schemas/job.schema';

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

  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
  ) {}

  async handleMessage(userId: string | null, chatDto: ChatMessageDto) {
    try {
      const matchedJobs = await this.searchJobsByText(chatDto.message);
      const jobContext = matchedJobs.length
        ? this.formatJobsForPrompt(matchedJobs)
        : 'No relevant job data found.';

      const completion = await deepseek.chat.completions.create({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          { role: 'system', content: this.systemPrompt },
          {
            role: 'user',
            content: this.buildUserPrompt(userId, chatDto, jobContext),
          },
        ],
        temperature: 0.7,
      });
      // Safety check before accessing the message
      if (!completion?.choices?.length || !completion.choices[0]?.message?.content) {
        throw new Error('No valid response from Deepseek completion API');
      }
      return this.processResponse(completion.choices[0].message.content);
    } catch (error) {
      throw new Error(`Chatbot error: ${error.message}`);
    }
  }

  private buildUserPrompt(userId: string | null, dto: ChatMessageDto, jobContext: string) {
    const context = dto.context ? `Context: ${dto.context}` : 'No specific context';
    return `User (${userId}): ${dto.message}\n${context}\n\nRelevant Jobs:\n${jobContext}`;
  }

  private formatJobsForPrompt(jobs: Job[]): string {
    return jobs.map(job =>
      `Job Title: ${job.title}
Company: ${job.company}
Location: ${job.city}, ${job.country}
Role: ${job.role} (${job.type})
Industry: ${job.industry ?? 'N/A'}
Deadline: ${job.applicationDeadline.toDateString()}
Link: ${job.applicationLink}`
    ).join('\n\n');
  }

  private async searchJobsByText(text: string): Promise<Job[]> {
    return this.jobModel.find({
      $text: { $search: text },
    }).limit(5).exec();
  }

  private processResponse(rawResponse: string) {
    return {
      message: rawResponse,
      timestamp: new Date().toISOString(),
    };
  }
}
