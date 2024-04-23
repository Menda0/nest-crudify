import mongoose from 'mongoose';
import { TestingModuleBuilder } from 'nestjs-crudify';
import { FilterLike } from 'nestjs-crudify-mongodb';
import { UsersService } from '../users/users.service';
import { TodosController } from './todos.controller';
import { TodoFilters } from './todos.filters';
import { TodosModule } from './todos.module';

jest.setTimeout(99999);

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

    const deserialisedTodo = {
      type: 'todo',
      name: 'Todo',
      description: 'Lorem impsum',
      user: {
        id: user.id,
      },
    };

    const createdTodoDto = await todosController.create(deserialisedTodo);

    expect(createdTodoDto).toBeDefined();
    expect(createdTodoDto.type).toBe('todo');
    expect(createdTodoDto.id).toBeDefined();
    expect(createdTodoDto.createdAt).toBeDefined();
    expect(createdTodoDto.updatedAt).toBeDefined();

    expect(createdTodoDto.description).toBe(deserialisedTodo.description);
    expect(createdTodoDto.name).toBe(deserialisedTodo.name);

    const createdTodoUserDto = createdTodoDto.user;

    expect(createdTodoUserDto).toBeDefined();
    expect(createdTodoUserDto.type).toBe('user');
    expect(createdTodoUserDto.id).toBeDefined();
    expect(createdTodoUserDto.createdAt).toBeDefined();
    expect(createdTodoUserDto.updatedAt).toBeDefined();

    expect(createdTodoUserDto.name).toBe(user.name);
    expect(createdTodoUserDto.email).toBe(user.email);
    expect(createdTodoUserDto.password).not.toBeDefined();
  });

  it('should create todo without user', async () => {
    const deserialisedTodo = {
      type: 'todo',
      name: 'Todo',
      description: 'Lorem impsum',
    };

    const createdTodoDto = await todosController.create(deserialisedTodo);

    expect(createdTodoDto).toBeDefined();
    expect(createdTodoDto.type).toBe('todo');
    expect(createdTodoDto.id).toBeDefined();
    expect(createdTodoDto.createdAt).toBeDefined();
    expect(createdTodoDto.updatedAt).toBeDefined();

    expect(createdTodoDto.description).toBe(deserialisedTodo.description);
    expect(createdTodoDto.name).toBe(deserialisedTodo.name);

    const createdTodoUserDto = createdTodoDto.user;

    expect(createdTodoUserDto).not.toBeDefined();
  });

  it('should search all todos', async () => {
    const user = await usersService.create({
      name: 'Name',
      email: 'Email',
      password: '123',
    });

    const deserialisedTodo1 = {
      type: 'todo',
      name: 'Todo 1',
      description: 'Lorem impsum 1',
      user: {
        id: user.id,
      },
    };

    const deserialisedTodo2 = {
      type: 'todo',
      name: 'Todo 2',
      description: 'Lorem impsum 2',
    };

    const createdTodoDto1 = await todosController.create(deserialisedTodo1);
    expect(createdTodoDto1).toBeDefined();

    const createdTodoDto2 = await todosController.create(deserialisedTodo2);
    expect(createdTodoDto2).toBeDefined();

    const allTodos = await todosController.search();

    expect(allTodos).toBeDefined();
    expect(allTodos.total).toBe(2);

    expect(allTodos.data).toBeDefined();
    expect(allTodos.data).toHaveLength(2);

    console.log(allTodos);
  });

  it('should search paginated todos - offset/limit', async () => {
    const user = await usersService.create({
      name: 'Name',
      email: 'Email',
      password: '123',
    });

    const deserialisedTodo1 = {
      type: 'todo',
      name: 'Todo 1',
      description: 'Lorem impsum 1',
      user: {
        id: user.id,
      },
    };

    const deserialisedTodo2 = {
      type: 'todo',
      name: 'Todo 2',
      description: 'Lorem impsum 2',
    };

    const createdTodoDto1 = await todosController.create(deserialisedTodo1);
    expect(createdTodoDto1).toBeDefined();

    const createdTodoDto2 = await todosController.create(deserialisedTodo2);
    expect(createdTodoDto2).toBeDefined();

    const allTodos = await todosController.search(undefined, undefined, {
      offset: 0,
      limit: 1,
    });

    expect(allTodos).toBeDefined();
    expect(allTodos.total).toBe(2);

    expect(allTodos.data).toBeDefined();
    expect(allTodos.data).toHaveLength(1);
  });

  it('should search paginated todos - number/size', async () => {
    const user = await usersService.create({
      name: 'Name',
      email: 'Email',
      password: '123',
    });

    const deserialisedTodo1 = {
      type: 'todo',
      name: 'Todo 1',
      description: 'Lorem impsum 1',
      user: {
        id: user.id,
      },
    };

    const deserialisedTodo2 = {
      type: 'todo',
      name: 'Todo 2',
      description: 'Lorem impsum 2',
    };

    const createdTodoDto1 = await todosController.create(deserialisedTodo1);
    expect(createdTodoDto1).toBeDefined();

    const createdTodoDto2 = await todosController.create(deserialisedTodo2);
    expect(createdTodoDto2).toBeDefined();

    const allTodos = await todosController.search(undefined, undefined, {
      number: 1,
      size: 1,
    });

    expect(allTodos).toBeDefined();
    expect(allTodos.total).toBe(2);

    expect(allTodos.data).toBeDefined();
    expect(allTodos.data).toHaveLength(1);
  });

  it('should NOT search paginated todos - bad combination', async () => {
    const user = await usersService.create({
      name: 'Name',
      email: 'Email',
      password: '123',
    });

    const deserialisedTodo1 = {
      type: 'todo',
      name: 'Todo 1',
      description: 'Lorem impsum 1',
      user: {
        id: user.id,
      },
    };

    const deserialisedTodo2 = {
      type: 'todo',
      name: 'Todo 2',
      description: 'Lorem impsum 2',
    };

    const createdTodoDto1 = await todosController.create(deserialisedTodo1);
    expect(createdTodoDto1).toBeDefined();

    const createdTodoDto2 = await todosController.create(deserialisedTodo2);
    expect(createdTodoDto2).toBeDefined();

    const allTodos = await todosController.search(undefined, undefined, {
      number: 1,
      limit: 1,
    });

    expect(allTodos).toBeDefined();
    expect(allTodos.data).toBeDefined();
    expect(allTodos.data).toHaveLength(0);
  });

  it('should search todos filtered', async () => {
    const user = await usersService.create({
      name: 'Name',
      email: 'Email',
      password: '123',
    });

    const deserialisedTodo1 = {
      type: 'todo',
      name: 'Todo 1',
      description: 'Lorem impsum 1',
      user: {
        id: user.id,
      },
    };

    const deserialisedTodo2 = {
      type: 'todo',
      name: 'Todo 2',
      description: 'Lorem impsum 2',
    };

    const createdTodoDto1 = await todosController.create(deserialisedTodo1);
    expect(createdTodoDto1).toBeDefined();

    const createdTodoDto2 = await todosController.create(deserialisedTodo2);
    expect(createdTodoDto2).toBeDefined();

    const filteredTodos = await todosController.search(
      undefined,
      undefined,
      undefined,
      new TodoFilters({ name: new FilterLike('name', '2') })
    );
    expect(filteredTodos).toBeDefined();
    expect(filteredTodos.total).toBe(1);
  });
});
