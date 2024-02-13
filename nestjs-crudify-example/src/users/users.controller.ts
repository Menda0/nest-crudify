import {
  Body,
  Controller,
  Get,
  Post,
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
  PopulateMany,
  parseObjectId,
} from 'nestjs-crudify-mongodb';
import { UserDto } from './users.dto';
import { UsersService } from './users.service';

class UserFilters extends SearchFilters {
  @TransformToFilter<Types.ObjectId[]>(new FilterMatchIn('_id'), (v) =>
    parseValues(v, parseObjectId)
  )
  id: FilterMatchIn<Types.ObjectId[]>;

  @TransformToFilter<string>(new FilterLike('name'))
  name: FilterLike;

  @TransformToFilter<string>(new FilterLike('email'))
  email: FilterLike;

  @TransformToFilter<any>(new FilterOr('nameOrEmail'), (v) => {
    return [new FilterLike('name', v), new FilterLike('email', v)];
  })
  nameOrEmail: FilterOr<any>;
}

@Controller('users')
@UseInterceptors(JsonApiSerializeInterceptor())
export class UsersController
  extends MongoController<UserDto, UsersService>
  implements CommonCrudController<UserDto>
{
  constructor(private usersService: UsersService) {
    super(usersService);
  }

  @Post()
  async create(@Body(new JsonApiDeserializerPipe()) body: any): Promise<any> {
    return await this._create(body);
  }

  @Get()
  search(
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('page') page?: Page,
    @Query('filter') filter?: UserFilters
  ) {
    return this._search(sort, search, page, filter, [
      new PopulateMany('todos', 'todos'),
    ]);
  }
}
