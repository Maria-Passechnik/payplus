import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private isValidIsraeliID(id: string): boolean {
    if (id.length !== 9 || isNaN(Number(id))) return false;
    const digits = id.split('').map(Number);
    const sum = digits.reduce((acc, digit, idx) => {
      let step = digit * ((idx % 2) + 1);
      if (step > 9) step -= 9;
      return acc + step;
    }, 0);
    return sum % 10 === 0;
  }

  async registerUser(data: {
    username: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    if (!this.isValidIsraeliID(data.username)) {
      throw new BadRequestException('Invalid Israeli ID');
    }

    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersService.findUser(data.username);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    return this.usersService.createUserWithDetails(data);
  }

  async validateUser(username: string, password: string): Promise<any> {
    if (!this.isValidIsraeliID(username)) {
      throw new BadRequestException('Invalid Israeli ID');
    }

    const user = await this.usersService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: storedPassword, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
