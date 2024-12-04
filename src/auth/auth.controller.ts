import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      username: string;
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
  ) {
    this.logger.log(`Registering user: ${body.username}`);
    try {
      const user = await this.authService.registerUser(body);
      this.logger.log(`User registered successfully: ${body.username}`);
      return { message: 'User registered successfully', user };
    } catch (error) {
      this.logger.error(
        `Failed to register user: ${body.username}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    this.logger.log(`Login attempt for user: ${username}`);
    try {
      const user = await this.authService.validateUser(username, password);
      if (!user._doc) {
        this.logger.warn(`Invalid credentials for user: ${username}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      this.logger.log(`User logged in successfully: ${username}`);
      return this.authService.login(user._doc);
    } catch (error) {
      this.logger.error(
        `Failed login attempt for user: ${username}`,
        error.stack,
      );
      throw error;
    }
  }
}
