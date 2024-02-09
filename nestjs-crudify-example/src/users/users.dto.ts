import { MongoDto, MongoDtoFactory } from 'nestjs-crudify-mongodb';
import { User } from '../database/User.schema';

type UserProperties = {
  id?: string;
  name?: string;
  createdAt?: number;
  updateAt?: number;
};

export class UserDto extends MongoDto {
  name?: string;
  description?: string;
  createdAt?: number;
  updateAt?: number;

  constructor({ id, name, createdAt, updateAt }: UserProperties | undefined) {
    super('user');
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updateAt = updateAt;
  }
}

export class UserDtoFactory implements MongoDtoFactory<User, UserDto> {
  create(e: User): UserDto {
    return new UserDto({
      id: String(e._id),
      name: e.name,
      createdAt: e.createdAt,
      updateAt: e.updatedAt,
    });
  }
}
