import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import configuration from '../config';
import { TodosModule } from '../todos/todos.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isTest = configService.get<string>('mongodb.isTest') == 'true';

        if (isTest) {
          const mongoServer = await MongoMemoryServer.create();
          await mongoose.connect(mongoServer.getUri());

          return { uri: mongoServer.getUri() };
        } else {
          return {
            uri: configService.get<string>('mongodb.uri'),
            dbName: configService.get<string>('mongodb.dbName'),
          };
        }
      },
      inject: [ConfigService],
    }),
    TodosModule,
    UsersModule,
  ],
})
export class AppModule {}
