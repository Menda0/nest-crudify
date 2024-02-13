import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFeature } from '../database/User.schema';
import { UsersController } from './users.controller';
import { UserDtoFactory } from './users.dto';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([UserFeature])],
  controllers: [UsersController],
  providers: [UsersService, UserDtoFactory],
  exports: [UsersService, UserDtoFactory],
})
export class UsersModule {}
