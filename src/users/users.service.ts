import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUser(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUserWithDetails(data: {
    username: string;
    fullName: string;
    email: string;
    password: string | number;
  }): Promise<User> {
    const passwordString = String(data.password);
    const hashedPassword = await bcrypt.hash(passwordString, 10);
    const newUser = new this.userModel({
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findUser(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
