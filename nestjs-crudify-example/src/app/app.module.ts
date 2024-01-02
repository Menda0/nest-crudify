import { Module } from '@nestjs/common';
import {TodosModule} from '../todos/todos.module';
import {MongooseModule} from '@nestjs/mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        return {uri: mongoServer.getUri()}
      }
    }),
    TodosModule
  ]
})
export class AppModule {}
