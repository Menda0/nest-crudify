import { Injectable } from '@nestjs/common';
import {MongoService} from 'nestjs-crudify';
import {TodoDto, TodoDtoFactory} from './todos.dto';
import {Todo, TodoDocument} from '../database/Todo.schema';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';

@Injectable()
export class TodosService extends MongoService<Todo, TodoDto>{
  constructor(@InjectModel(Todo.name) readonly repository: Model<TodoDocument>, factory: TodoDtoFactory) {
    super(repository, factory);
  }
}
