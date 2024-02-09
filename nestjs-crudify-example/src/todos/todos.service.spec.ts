import mongoose from 'mongoose';
import { TestingModuleBuilder } from 'nestjs-crudify';
import { PopulateOne } from 'nestjs-crudify-mongodb';
import { UserDto } from '../users/users.dto';
import { TodoDto } from './todos.dto';
import { TodosModule } from './todos.module';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let todosService: TodosService;

  let moduleBuilder: TestingModuleBuilder;

  beforeEach(async () => {
    moduleBuilder = new TestingModuleBuilder()
      .withMongoInMemory()
      .withImports(TodosModule);

    await moduleBuilder.build();

    todosService = moduleBuilder.module.get<TodosService>(TodosService);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await moduleBuilder.mongoServer.stop();
    await moduleBuilder.module.close();
  });

  it('should be defined', () => {
    expect(todosService).toBeDefined();
  });

  it('should add todo with user', async () => {
    const todo = new TodoDto({
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
      user: new UserDto({ name: 'Name' }),
    });

    const todoInDb = await todosService.create(todo);

    expect(todoInDb).toBeDefined();
    expect(todoInDb.id).toBeDefined();
    expect(todoInDb.name).toEqual(todo.name);
    expect(todoInDb.description).toEqual(todo.description);
    expect(todoInDb.user.id!).toBeDefined();
    expect(todoInDb.type).toEqual('todo');
  });

  it('should search todo with populated user', async () => {
    const todo = new TodoDto({
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
      user: new UserDto({ name: 'Name' }),
    });

    await todosService.create(todo);

    const res = await todosService.search({
      populate: [new PopulateOne('user', 'users')],
    });

    expect(res).toBeDefined();
  }, 999999999);

  it('should add todo', async () => {
    const todo = new TodoDto({
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
    });

    const todoInDb = await todosService.create(todo);

    expect(todoInDb).toBeDefined();
    expect(todoInDb.id).toBeDefined();
    expect(todoInDb.name).toEqual(todo.name);
    expect(todoInDb.description).toEqual(todo.description);
    expect(todoInDb.type).toEqual('todo');
  });

  it('should list all todos', async () => {
    const todo = new TodoDto({
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
    });

    await Promise.all([
      todosService.create(todo),
      todosService.create(todo),
      todosService.create(todo),
    ]);

    const todosInDb = await todosService.search();

    expect(todosInDb).toBeDefined();
    expect(todosInDb.total).toEqual(3);
    expect(todosInDb.data.length).toEqual(todosInDb.total);
  });

  it('should get todo by id', async () => {
    const todo = new TodoDto({
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
    });

    const addedTodo = await todosService.create(todo);
    expect(addedTodo).toBeDefined();
    expect(addedTodo.id).toBeDefined();

    const todoInDb = await todosService.get(addedTodo.id);
    expect(todoInDb).toBeDefined();
    expect(todoInDb.id).toEqual(addedTodo.id);
  });

  it('should update todo', async () => {
    const todo = new TodoDto({
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
    });

    const addedTodo = await todosService.create(todo);
    expect(addedTodo).toBeDefined();
    expect(addedTodo.id).toBeDefined();
    expect(addedTodo.createdAt).toBeDefined();
    expect(addedTodo.updateAt).toBeDefined();

    addedTodo.name = 'Updated todo';

    const updateTodo = await todosService.update(addedTodo.id, addedTodo);

    expect(updateTodo).toBeDefined();
    expect(updateTodo.id).toBeDefined();
    expect(updateTodo.id).toEqual(addedTodo.id);
    expect(updateTodo.createdAt).toBeDefined();
    expect(updateTodo.updateAt).toBeDefined();
    expect(updateTodo.createdAt).toEqual(addedTodo.createdAt);
    expect(updateTodo.updateAt).not.toEqual(addedTodo.updateAt);
  });
});
