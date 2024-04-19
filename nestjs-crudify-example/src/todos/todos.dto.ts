import { Injectable } from '@nestjs/common';
import { MongoDto, MongoFactory } from 'nestjs-crudify-mongodb';
import { Todo } from '../database/Todo.schema';
import { UserDto } from '../users/users.dto';
import {Expose, Type} from 'class-transformer';



export class TodoDto extends MongoDto {
  @Expose()
  name?: string;
  @Expose()
  description?: string;
  @Expose()
  @Type(() => UserDto)
  user?: UserDto;
  @Expose()
  createdAt?: number;
  @Expose()
  updatedAt?: number;

  constructor() {
    super('todo', ['user']);
  }
}
@Injectable()
export class TodoFactory extends MongoFactory<Todo, TodoDto> {
  constructor() {
    super(TodoDto)
  }
}
