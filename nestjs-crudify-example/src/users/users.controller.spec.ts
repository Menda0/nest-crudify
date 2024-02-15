import mongoose from 'mongoose';
import { TestingModuleBuilder } from 'nestjs-crudify';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';

describe('UsersController', () => {
  let usersController: UsersController;
  let moduleBuilder: TestingModuleBuilder;

  beforeEach(async () => {
    moduleBuilder = new TestingModuleBuilder()
      .withMongoInMemory()
      .withImports(UsersModule);

    await moduleBuilder.build();

    usersController =
      moduleBuilder.module.get<UsersController>(UsersController);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await moduleBuilder.mongoServer.stop();
    await moduleBuilder.module.close();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
});
