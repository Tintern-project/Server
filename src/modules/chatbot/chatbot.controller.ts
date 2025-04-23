// src/modules/chatbot/chatbot.controller.ts
import {
    Body,
    Controller,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiBadRequestResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { ChatbotService } from './chatbot.service';
  import { ChatMessageDto } from './dto/chat-message.dto';
  import { AuthGuard } from 'src/Auth/guards/authentication.guard';
  import { GetUser } from 'src/Auth/decorators/get-user.decorator';
  import { Public } from 'src/Auth/decorators/public.decorator';

    @ApiTags('chatbot')
    @UseGuards(AuthGuard)
    @Controller('chatbot')
    export class ChatbotController {
    constructor(private readonly chatbotService: ChatbotService) {}

    @Public()                            // ← no auth here
    @Post('message')
    @ApiOperation({ summary: 'Send a message to the chatbot and receive a response' })
    @ApiBody({ type: ChatMessageDto })
    @ApiResponse({ status: 201, description: 'Chatbot responded successfully' })
    @ApiBadRequestResponse({ description: 'Validation failed for input DTO' })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async handleMessage(
        @Body() chatDto: ChatMessageDto,   // note: no @GetUser() here
    ) {
        // since there's no userId, you can pass `null` or some default
        return this.chatbotService.handleMessage(null, chatDto);
    }
    }
