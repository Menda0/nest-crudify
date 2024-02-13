import { MongoDto, MongoDtoFactory } from 'nestjs-crudify-mongodb';
import { User } from '../database/User.schema';

type UserProperties = {
  id?: string;
  name?: string;
  email?: string;
  createdAt?: number;
  updateAt?: number;
};

export class UserDto extends MongoDto {
  name?: string;
  email?: string;
  createdAt?: number;
  updateAt?: number;

  constructor({
    id,
    name,
    email,
    createdAt,
    updateAt,
  }: UserProperties | undefined) {
    super('user');

    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updateAt = updateAt;
  }
}

export class UserDtoFactory implements MongoDtoFactory<User, UserDto> {
  create(e: User): UserDto {
    return new UserDto({
      id: String(e._id),
      name: e.name,
      email: e.email,
      createdAt: e.createdAt,
      updateAt: e.updatedAt,
    });
  }
}
