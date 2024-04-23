import { Expose } from 'class-transformer';
import { MongoDto, MongoFactory } from 'nestjs-crudify-mongodb';
import { User } from '../database/User.schema';

export class UserDto extends MongoDto {
  @Expose()
  name?: string;
  @Expose()
  email?: string;
  @Expose()
  password?: string;
  @Expose()
  createdAt?: number;
  @Expose()
  updatedAt?: number;

  constructor() {
    super('user');
  }
}

export class UserDtoFactory extends MongoFactory<User, UserDto> {
  constructor() {
    super(User, UserDto);
  }
}
