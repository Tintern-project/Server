import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/modules/user/dto/CreateUserDto';
import { SignInDto } from './dto/SignInDto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  // Method to Register a user
  async register(user: CreateUserDto): Promise<string> {
    user.email = user.email.toLowerCase();
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: CreateUserDto = { ...user, password: hashedPassword };
    const USER = await this.userService.create(newUser);
    return 'registered successfully';
  }

  // Method to login a user
  async login(user: SignInDto) : Promise<{ accessToken : string; user : any }> {
    user.email = user.email.toLowerCase();
    const existingUser = await this.userService.findByEmail(user.email);
    //Check if user exists
    if(!existingUser)
      throw new UnauthorizedException('Invalid Credentials');
    const isValid = await bcrypt.compare(user.password, existingUser.password);
    //Check if the password is correct
    if(!isValid)
      throw new UnauthorizedException('Invalid Credentials');
    //Create token
    const payload = { userId: existingUser.id, email: existingUser.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name
      }
    };
  }
}
