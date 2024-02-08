import { Injectable } from '@nestjs/common';
import {TodoDto, TodoDtoFactory} from './todos.dto';
import {Todo, TodoDocument} from '../database/Todo.schema';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {MongoService} from 'nestjs-crudify-mongodb';

@Injectable()
export class TodosService extends MongoService<Todo, TodoDto>{
  constructor(@InjectModel(Todo.name) readonly repository: Model<TodoDocument>, factory: TodoDtoFactory) {
    super(repository, factory);
  }
}
