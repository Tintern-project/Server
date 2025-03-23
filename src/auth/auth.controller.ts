import { Body, Controller, HttpStatus, Post, HttpException, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/SignInDto';
import { CreateUserDto } from 'src/modules/user/dto/CreateUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  
  @Post('register')
  async signup(@Body() registerRequestDto: CreateUserDto) {
    try {
      // Call the AuthService to handle registration
      const result = await this.authService.register(registerRequestDto);
      // Return a success response with HTTP 201 Created status
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error) {
      // Handle specific errors, such as email already exists or validation errors
      if (error.status === 409) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'User already exists',
          },
          HttpStatus.CONFLICT,
        );
      }

      // Catch any other errors and throw a generic internal server error
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during registration',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() loginRequestDto : SignInDto){
    try{
      const { accessToken, user } = await this.authService.login(loginRequestDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successful Login',
        accessToken,
        user
      }
    }
    catch (error) {
      if(error instanceof HttpException)
        throw error;
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during login',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
