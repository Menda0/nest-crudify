import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoService, PopulateOne } from 'nestjs-crudify-mongodb';
import { Todo, TodoDocument } from '../database/Todo.schema';
import { UsersService } from '../users/users.service';
import { TodoDto, TodoFactory } from './todos.dto';

@Injectable()
export class TodosService extends MongoService<Todo, TodoDto> {
  constructor(
    @InjectModel(Todo.name) readonly repository: Model<TodoDocument>,
    factory: TodoFactory,

    private readonly usersService: UsersService
  ) {
    super(repository, factory);
  }

  override async create(data: TodoDto): Promise<TodoDto> {
    const userId = data?.user?.id;

    if (userId) {
      // * It throws error if user with userId does not exist.
      await this.usersService.get(userId);
    }

    const todoEntity = this.factory.createEntity(data);
    const created = await super.create(todoEntity);

    return this.get(created.id, [
      new PopulateOne({ localField: 'user', from: 'user' }),
    ]);
  }
}
