import mongoose from 'mongoose';
import { TestingModuleBuilder } from 'nestjs-crudify';
import { TodosController } from './todos.controller';
import { TodosModule } from './todos.module';

describe('TodosController', () => {
  let controller: TodosController;
  let moduleBuilder: TestingModuleBuilder;

  beforeEach(async () => {
    moduleBuilder = new TestingModuleBuilder()
      .withMongoInMemory()
      .withImports(TodosModule);

    await moduleBuilder.build();

    controller = moduleBuilder.module.get<TodosController>(TodosController);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await moduleBuilder.mongoServer.stop();
    await moduleBuilder.module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    const jsonData = await controller.create(input);

    expect(jsonData).toBeDefined();
  }, 99999);

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

    const jsonResponse = await controller.create(input);

    expect(jsonResponse).toBeDefined();

    const searchResult = await controller.search();

    expect(searchResult).toBeDefined();
  });
});
