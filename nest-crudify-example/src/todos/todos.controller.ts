import {Body, Controller, Get, Post, UseInterceptors, Query} from '@nestjs/common';
import {
  CommonCrudController, FilterLike, FilterMatch, FilterMatchIn,
  JsonApiDeserializerPipe,
  JsonApiSerializeInterceptor,
  MongoController,
  Page, parseObjectId, parseValues,
  SearchFilters,
  TransformToFilter,
} from 'nest-crudify';
import {TodosService} from './todos.service';
import {TodoDto} from './todos.dto';
import {ObjectId, Types} from 'mongoose';

class TodoFilters extends SearchFilters{
  @TransformToFilter<Types.ObjectId[]>(new FilterMatchIn("_id"), (v) => parseValues(v, parseObjectId))
  id: FilterMatchIn<Types.ObjectId[]>
  @TransformToFilter<string>(new FilterMatch("name"))
  name: FilterLike
  @TransformToFilter<string>(new FilterLike("description"))
  description: FilterLike
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
    @Query('page') page?: Page,
    @Query('filter') filter?: TodoFilters,
  ){
    return this._search(sort, search, page, filter)
  }
}
