import { TodosController } from './todos.controller';
import {TestingModuleBuilder} from 'nestjs-crudify';
import {TodosModule} from './todos.module';

describe('TodosController', () => {
  let controller: TodosController;
  let moduleBuilder: TestingModuleBuilder

  beforeEach(async () => {
    moduleBuilder = new TestingModuleBuilder()
      .withMongoInMemory()
      .withImports(TodosModule)

    await moduleBuilder.build()

    controller = moduleBuilder.module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create todo', async () => {
    const input = {
      data: {
        type: "todos",
        attributes: {
          name: "Todo",
          description: "Lorem impsum"
        }
      }
    } as any

    const jsonData = await controller.create(input);

    expect(jsonData).toBeDefined();
  })
});
