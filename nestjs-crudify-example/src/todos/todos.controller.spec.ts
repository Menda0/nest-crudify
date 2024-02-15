import mongoose from 'mongoose';
import { TestingModuleBuilder } from 'nestjs-crudify';
import { UsersService } from '../users/users.service';
import { TodosController } from './todos.controller';
import { TodosModule } from './todos.module';

describe('TodosController', () => {
  let todosController: TodosController;
  let usersService: UsersService;
  let moduleBuilder: TestingModuleBuilder;

  beforeEach(async () => {
    moduleBuilder = new TestingModuleBuilder()
      .withMongoInMemory()
      .withImports(TodosModule);

    await moduleBuilder.build();

    todosController =
      moduleBuilder.module.get<TodosController>(TodosController);
    usersService = moduleBuilder.module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await moduleBuilder.mongoServer.stop();
    await moduleBuilder.module.close();
  });

  it('should be defined', () => {
    expect(todosController).toBeDefined();
  });

  it('should create todo with user', async () => {
    const user = await usersService.create({
      name: 'Name',
      email: 'Email',
      password: '123',
    });

    const input = {
      type: 'todos',
      name: 'Todo',
      description: 'Lorem impsum',
      user: {
        id: user.id,
      },
    };

    const jsonData = await todosController.create(input);

    expect(jsonData).toBeDefined();
  });

  it('should create todo', async () => {
    const input = {
      data: {
        type: 'todos',
        attributes: {
          name: 'Todo',
          description: 'Lorem impsum',
        },
      },
    };

    const jsonData = await todosController.create(input);

    expect(jsonData).toBeDefined();
  });

  it('should search todo', async () => {
    const input = {
      data: {
        type: 'todos',
        attributes: {
          name: 'Todo',
          description: 'Lorem impsum',
        },
      },
    };

    const jsonResponse = await todosController.create(input);

    expect(jsonResponse).toBeDefined();

    const searchResult = await todosController.search();

    expect(searchResult).toBeDefined();
  });
});
