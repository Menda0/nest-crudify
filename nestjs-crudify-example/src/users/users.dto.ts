import mongoose from 'mongoose';
import { MongoDto, MongoDtoFactory } from 'nestjs-crudify-mongodb';
import { User } from '../database/User.schema';

type UserProperties = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  createdAt?: number;
  updateAt?: number;
};

export class UserDto extends MongoDto {
  name?: string;
  email?: string;
  password?: string;
  createdAt?: number;
  updateAt?: number;

  constructor({
    id,
    name,
    email,
    password,
    createdAt,
    updateAt,
  }: UserProperties | undefined) {
    super('user');

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updateAt = updateAt;
  }
}

export class UserDtoFactory implements MongoDtoFactory<User, UserDto> {
  create(e: User): UserDto {
    return new UserDto({
      id: String(e?._id),
      name: e?.name,
      email: e?.email,
      password: e?.password,
      createdAt: e?.createdAt,
      updateAt: e?.updatedAt,
    });
  }

  createEntity(dto: UserDto): User {
    const entity = new User();

    entity._id = new mongoose.Types.ObjectId(dto.id);
    entity.name = dto.name;
    entity.email = dto.email;
    entity.password = dto.password;
    entity.createdAt = dto.createdAt;
    entity.updatedAt = dto.updateAt;

    return entity;
  }
}
