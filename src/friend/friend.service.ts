import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Friend } from './schemas/friend.schema';

import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(Friend.name)
    private friendModel: mongoose.Model<Friend>,
  ) {}

  async findAll(query: Query): Promise<Friend[]> {

    const friends = await this.friendModel.find()
    
    return friends;
  }

  getAll() {
    return this.friendModel.find();
  }
}
