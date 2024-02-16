import { Injectable } from '@nestjs/common';
import { MongoDto, MongoFactory, parseObjectId } from 'nestjs-crudify-mongodb';
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
    super('todo', ['user']);
    this.id = id;
    this.name = name;
    this.user = user;
    this.description = description;
    this.createdAt = createdAt;
    this.updateAt = updateAt;
  }
}
@Injectable()
export class TodoFactory implements MongoFactory<Todo, TodoDto> {
  constructor(private userDtoFactory: UserDtoFactory) {}

  createDto(e: Todo): TodoDto {
    return new TodoDto({
      id: String(e._id),
      name: e.name,
      description: e.description,
      user: e.user ? this.userDtoFactory.createDto(e.user) : undefined,
      createdAt: e.createdAt,
      updateAt: e.updatedAt,
    });
  }

  createEntity(dto: TodoDto): Todo {
    const entity = new Todo();

    entity._id = parseObjectId(dto.id);
    entity.name = dto.name;
    entity.description = dto.description;
    entity.user = dto.user
      ? this.userDtoFactory.createEntity(dto.user)
      : undefined;
    entity.createdAt = dto.createdAt;
    entity.updatedAt = dto.updateAt;

    return entity;
  }
}
