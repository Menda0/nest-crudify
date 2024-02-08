import { Injectable } from '@nestjs/common';
import { MongoDto, MongoDtoFactory } from 'nestjs-crudify-mongodb';
import { Todo } from '../database/Todo.schema';
import { UserDto, UserDtoFactory } from '../users/users.dto';

type TodoProperties = {
  id?: string;
  name?: string;
  description?: string;
  user?: UserDto;
  createdAt?: number;
  updateAt?: number;
};

export class TodoDto extends MongoDto {
  name?: string;
  description?: string;
  user?: UserDto;
  createdAt?: number;
  updateAt?: number;

  constructor({
    id,
    name,
    description,
    user,
    createdAt,
    updateAt,
  }: TodoProperties | undefined) {
    super('todo');
    this.id = id;
    this.name = name;
    this.user = user;
    this.description = description;
    this.createdAt = createdAt;
    this.updateAt = updateAt;
  }
}
@Injectable()
export class TodoDtoFactory implements MongoDtoFactory<Todo, TodoDto> {
  constructor(private userDtoFactory: UserDtoFactory) {}

  create(e: Todo): TodoDto {
    return new TodoDto({
      id: String(e._id),
      name: e.name,
      description: e.description,
      user: e.user ? this.userDtoFactory.create(e.user) : undefined,
      createdAt: e.createdAt,
      updateAt: e.updatedAt,
    });
  }
}
