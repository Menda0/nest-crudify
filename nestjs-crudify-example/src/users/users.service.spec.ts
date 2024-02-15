import mongoose from 'mongoose';
import { TestingModuleBuilder } from 'nestjs-crudify';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let moduleBuilder: TestingModuleBuilder;
  let usersService: UsersService;

  beforeEach(async () => {
    moduleBuilder = new TestingModuleBuilder()
      .withMongoInMemory()
      .withImports(UsersModule);

    await moduleBuilder.build();

    usersService = moduleBuilder.module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await moduleBuilder.mongoServer.stop();
    await moduleBuilder.module.close();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
