import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoService, PopulateOne } from 'nestjs-crudify-mongodb';
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

  override async create(data: TodoDto): Promise<TodoDto> {
    if (data?.user?.id) {
      const userDto = await this.usersService.get(data.user.id);

      if (!userDto) {
        // ! Throw error user does not exist
      }
    }

    const todoEntity = this.dtoFactory.createEntity(data);

    const created = await super.create(todoEntity);

    return this.get(created.id, [new PopulateOne('user', 'user')]);
  }
}
