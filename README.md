# NestJsCrudify
The objective of NestJsCrudify is to create a generic layer for accessing databases through an API. This powerful library aims to simplify and streamline the development process by leveraging the Nestjs module architecture. With NestJsCrudify, you can easily interact with your entity by utilizing a generic service that provides essential methods. Furthermore, to expedite the development of new API resources, there is an optional base implementation for a controller included in the library. This feature allows you to save time and effort while building your API. It's worth noting that NestJsCrudify fully supports JSON:API, providing capabilities for deserializing and serializing your API data seamlessly.

## Install

```
npm install nestjs-crudify
// or
yarn add nestjs-crudify
```

## Quick Start
1. Create a mongo entity
```typescript
@Schema({ timestamps: true })
export class Todo{
  @Prop()
  name?: string;

  @Prop()
  description?: string;
}

export type TodoDocument = HydratedDocument<Todo>;
export const TodoSchema = SchemaFactory.createForClass(Todo);
export const TodoFeature = {
  name: Todo.name,
  schema: TodoSchema,
};
```
2. Create a Dto and Dto Factory
```typescript
import {MongoDto} from 'nestjs-crudify';
import {Todo} from '../database/Todo.schema';

type TodoProperties = {
  id?: string
  name?: string
  description?: string
  createdAt?: number
  updateAt?: number
}

export class TodoDto extends MongoDto{
  name?: string
  description?: string
  createdAt?: number
  updateAt?: number

  constructor({id, name, description, createdAt, updateAt}: TodoProperties | undefined) {
    super("todo");
    this.id = id
    this.name = name;
    this.description = description
    this.createdAt = createdAt
    this.updateAt = updateAt
  }
}
```
3. Create the service and use the Dto and Entity as parameters
```typescript
@Injectable()
export class TodosService extends MongoService<Todo, TodoDto>{
  constructor(@InjectModel(Todo.name) readonly repository: Model<TodoDocument>, factory: TodoDtoFactory) {
    super(repository, factory);
  }
}
```
4. Create the controller
```typescript
import {Body, Controller, Get, Post, UseInterceptors, Query, Delete, Param, Put} from '@nestjs/common';
import {
  CommonCrudController, FilterLike, FilterMatch, FilterMatchIn,
  JsonApiDeserializerPipe,
  JsonApiSerializeInterceptor,
  MongoController,
  Page, parseObjectId, parseValues,
  SearchFilters,
  TransformToFilter,
} from 'nestjs-crudify';
import {TodosService} from './todos.service';
import {TodoDto} from './todos.dto';
import {Types} from 'mongoose';

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

  @Put(":id")
  update(@Param('id') id: string,@Body(new JsonApiDeserializerPipe()) body: any ): Promise<any> {
    return this._update(id, body)
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

  @Delete(":id")
  delele(@Param('id') id: string){
    return this._delete(id)
  }
}

```
6. Create the module
```typescript
import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import {TodoDtoFactory} from './todos.dto';
import {MongooseModule} from '@nestjs/mongoose';
import {TodoFeature} from '../database/Todo.schema';
import { TodosController } from './todos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      TodoFeature
    ]),
  ],
  providers: [TodosService, TodoDtoFactory],
  controllers: [TodosController]
})
export class TodosModule {}
```
Make sure that you have defined a proper mongodb database connection
