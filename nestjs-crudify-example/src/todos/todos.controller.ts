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
import { Types } from 'mongoose';
import {
  CommonCrudController,
  JsonApiDeserializerPipe,
  JsonApiSerializeInterceptor,
  Page,
  SearchFilters,
  TransformToFilter,
  parseValues,
} from 'nestjs-crudify';
import {
  FilterLike,
  FilterMatchIn,
  FilterOr,
  MongoController,
  PopulateOne,
  parseObjectId,
} from 'nestjs-crudify-mongodb';
import { TodoDto } from './todos.dto';
import { TodosService } from './todos.service';

class TodoFilters extends SearchFilters {
  @TransformToFilter<Types.ObjectId[]>(new FilterMatchIn('_id'), (v) =>
    parseValues(v, parseObjectId)
  )
  id: FilterMatchIn<Types.ObjectId[]>;

  @TransformToFilter<string>(new FilterLike('name'))
  name: FilterLike;

  @TransformToFilter<string>(new FilterLike('description'))
  description: FilterLike;

  @TransformToFilter<any>(new FilterOr('descriptionOrName'), (v) => {
    return [new FilterLike('description', v), new FilterLike('name', v)];
  })
  descriptionOrName: FilterOr<any>;
}

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
  create(@Body(new JsonApiDeserializerPipe()) body: any): Promise<any> {
    return this._create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new JsonApiDeserializerPipe()) body: any
  ): Promise<any> {
    return this._update(id, body);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.todosService.get(id, [new PopulateOne('user', 'users')]);
  }

  @Get()
  search(
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('page') page?: Page,
    @Query('filter') filter?: TodoFilters
  ) {
    return this._search(sort, search, page, filter, [
      new PopulateOne('user', 'users'),
    ]);
  }

  @Delete(':id')
  delele(@Param('id') id: string) {
    return this._delete(id);
  }
}
