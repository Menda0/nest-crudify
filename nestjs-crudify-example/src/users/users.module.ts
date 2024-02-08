import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFeature } from '../database/User.schema';
import { UserDtoFactory } from './users.dto';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([UserFeature])],
  providers: [UsersService, UserDtoFactory],
  exports: [UsersService, UserDtoFactory],
})
export class UsersModule {}
