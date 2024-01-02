import {Body, Controller, Post, UseInterceptors} from '@nestjs/common';
import {
  CommonCrudController,
  JsonApiDeserializerPipe,
  JsonApiSerializeInterceptor,
  MongoController,
} from 'nest-crudify';
import {TodosService} from './todos.service';
import {TodoDto} from './todos.dto';

@Controller('todos')
@UseInterceptors(JsonApiSerializeInterceptor())
export class TodosController extends MongoController<TodoDto, TodosService> implements CommonCrudController<TodoDto>{

  constructor(private todosService: TodosService) {
    super(todosService)
  }

  @Post()
  create(@Body(new JsonApiDeserializerPipe()) body: any): Promise<any> {
    return this._create(body)
  }
}
