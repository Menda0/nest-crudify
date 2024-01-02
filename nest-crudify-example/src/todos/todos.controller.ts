import {Body, Controller, Get, Post, UseInterceptors, Query} from '@nestjs/common';
import {
  CommonCrudController,
  JsonApiDeserializerPipe,
  JsonApiSerializeInterceptor,
  MongoController,
  Page, ParsePage, SearchFilters,
} from 'nest-crudify';
import {TodosService} from './todos.service';
import {TodoDto} from './todos.dto';

class TodoFilters extends SearchFilters{

}

@Controller('todos')
@UseInterceptors(JsonApiSerializeInterceptor())
export class TodosController extends MongoController<TodoDto, TodosService> implements CommonCrudController<TodoDto>{

  constructor(private todosService: TodosService) {
    super(todosService)
  }

  @Post()
  create(@Body(new JsonApiDeserializerPipe()) body: any ): Promise<any> {
    return this._create(body)
  }

  @Get()
  search(
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('page', new ParsePage()) page?: Page,
    @Query('filter') filter?: TodoFilters,
  ){
    return this._search(sort, search, page, filter)
  }
}
