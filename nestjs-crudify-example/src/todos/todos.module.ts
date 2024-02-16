import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoFeature } from '../database/Todo.schema';
import { UsersModule } from './../users/users.module';
import { TodosController } from './todos.controller';
import { TodoFactory } from './todos.dto';
import { TodosService } from './todos.service';

@Module({
  imports: [UsersModule, MongooseModule.forFeature([TodoFeature])],
  providers: [TodosService, TodoFactory],
  controllers: [TodosController],
})
export class TodosModule {}
