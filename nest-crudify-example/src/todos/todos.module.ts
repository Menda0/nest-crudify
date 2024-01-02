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
