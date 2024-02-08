import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoService } from 'nestjs-crudify-mongodb';
import { Todo, TodoDocument } from '../database/Todo.schema';
import { UsersService } from '../users/users.service';
import { TodoDto, TodoDtoFactory } from './todos.dto';

@Injectable()
export class TodosService extends MongoService<Todo, TodoDto> {
  constructor(
    @InjectModel(Todo.name) readonly repository: Model<TodoDocument>,
    factory: TodoDtoFactory,

    private readonly usersService: UsersService
  ) {
    super(repository, factory);
  }

  override async create(data: any): Promise<TodoDto> {
    if (data.user) {
      const userDto = await this.usersService.create(data.user);
      data.user = userDto.id;
    }

    return super.create(data);
  }
}
