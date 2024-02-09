import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoService } from 'nestjs-crudify-mongodb';
import { User, UserDocument } from '../database/User.schema';
import { UserDto, UserDtoFactory } from './users.dto';

@Injectable()
export class UsersService extends MongoService<User, UserDto> {
  constructor(
    @InjectModel(User.name) readonly repository: Model<UserDocument>,
    factory: UserDtoFactory
  ) {
    super(repository, factory);
  }
}
