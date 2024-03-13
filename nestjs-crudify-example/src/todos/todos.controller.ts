import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  CommonCrudController,
  JsonApiDeserializerPipe,
  JsonApiSerializeInterceptor,
  Page,
} from 'nestjs-crudify';
import { MongoController, PopulateOne } from 'nestjs-crudify-mongodb';
import { TodoDto } from './todos.dto';
import { TodoFilters, TodoSearch } from './todos.filters';
import { TodosService } from './todos.service';

@Controller('todos')
@UseInterceptors(JsonApiSerializeInterceptor())
export class TodosController
  extends MongoController<TodoDto, TodosService>
  implements CommonCrudController<TodoDto>
{
  constructor(private todosService: TodosService) {
    super(todosService);
  }

  @Post()
  create(@Body(new JsonApiDeserializerPipe()) body: any): Promise<TodoDto> {
    return this._create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new JsonApiDeserializerPipe()) body: any
  ): Promise<TodoDto> {
    return this._update(id, body);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.todosService.get(id, [
      new PopulateOne({ localField: 'user', from: 'user' }),
    ]);
  }

  @Get()
  search(
    @Query('sort') sort?: string,
    @Query('search') search?: TodoSearch,
    @Query('page') page?: Page,
    @Query('filter') filter?: TodoFilters
  ) {
    return this._search(sort, search, page, filter, [
      new PopulateOne({ localField: 'user', from: 'user' }),
    ]);
  }

  @Delete(':id')
  delele(@Param('id') id: string) {
    return this._delete(id);
  }
}
