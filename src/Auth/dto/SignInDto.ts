import { IsString, IsArray, ArrayNotEmpty, IsEmail, IsUrl, IsOptional, MinLength  } from 'class-validator';

export class SignInDto {
      @IsEmail()
      email: string;
    
      @IsString()
      password: string;
  }