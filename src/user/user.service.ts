import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './user.entity';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async create(payload: any) {
    try {
      console.log('payload', payload);

      const createdUser = new this.userModel({
        ...payload,
        email: payload.email.toLowerCase(),
        password: crypto.createHmac('sha256', payload.password).digest('hex'),
      });

      // save user
      const user = await createdUser.save();

      // return user without password
      const { password, ...result } = user.toObject();

      return result;
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(error.response);
    }
  }

  getUserByEmailAndPassword(payload): Promise<any> {
    console.log('payload', payload);
    return this.userModel.findOne({
      email: payload.email.toLowerCase(),
      password: crypto.createHmac('sha256', payload.password).digest('hex'),
    });
  }

  getUserById(id): Promise<any> {
    return this.userModel
      .findById(id)

      .select('-password')

      .lean();
  }
}
