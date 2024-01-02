import { Injectable } from '@nestjs/common';
import {MongoService} from 'nest-crudify';
import {TodoDto, TodoDtoFactory} from './todos.dto';
import {Todo, TodoDocument} from '../database/Todo.schema';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';

@Injectable()
export class TodosService extends MongoService<Todo, TodoDto, any>{
  constructor(@InjectModel(Todo.name) readonly todoRepository: Model<TodoDocument>, todoDtoFactory: TodoDtoFactory) {
    super(todoRepository, todoDtoFactory);
  }
}
