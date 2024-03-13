import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  CommonCrudController,
  JsonApiDeserializerPipe,
  JsonApiSerializeInterceptor,
  Page,
} from 'nestjs-crudify';
import { MongoController, PopulateMany } from 'nestjs-crudify-mongodb';
import { UserDto } from './users.dto';
import { UserFilters, UserSearch } from './users.filters';
import { UsersService } from './users.service';

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
    @Query('search') search?: UserSearch,
    @Query('page') page?: Page,
    @Query('filter') filter?: UserFilters
  ) {
    return this._search(sort, search, page, filter, [
      new PopulateMany({ localField: 'todos', from: 'todo' }),
    ]);
  }
}
