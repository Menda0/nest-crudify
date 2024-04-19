import mongoose, { Types} from 'mongoose';
import { TestingModuleBuilder } from 'nestjs-crudify';
import { FilterLike, FilterOr, PopulateOne } from 'nestjs-crudify-mongodb';
import { UsersService } from '../users/users.service';
import { TodoFilters, TodoSearch } from './todos.filters';
import { TodosModule } from './todos.module';
import { TodosService } from './todos.service';

jest.setTimeout(99999);

describe('TodosService', () => {
  let todosService: TodosService;
  let usersService: UsersService;

  let moduleBuilder: TestingModuleBuilder;

  beforeEach(async () => {
    moduleBuilder = new TestingModuleBuilder()
      .withMongoInMemory()
      .withImports(TodosModule);

    await moduleBuilder.build();

    todosService = moduleBuilder.module.get<TodosService>(TodosService);
    usersService = moduleBuilder.module.get<UsersService>(UsersService);
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
    const userInDb = await usersService.create({
      name: 'a',
      email: 'b',
      password: '-1',
    });

    const todo = {
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
      user: new Types.ObjectId(userInDb.id),
    };

    const todoInDb = await todosService.create(todo);

    expect(todoInDb).toBeDefined();
    expect(todoInDb.id).toBeDefined();
    expect(todoInDb.name).toEqual(todo.name);
    expect(todoInDb.description).toEqual(todo.description);
    expect(todoInDb.user.id!).toBeDefined();
    expect(todoInDb.type).toEqual('todo');
  });

  it('should search todo with populated user', async () => {
    const userInDb = await usersService.create({
      name: 'a',
      email: 'b',
      password: '-1',
    });

    const todo = {
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
      user: new Types.ObjectId(userInDb.id),
    };

    const adddedTodo = await todosService.create(todo);

    expect(adddedTodo.user).toBeDefined()

    const res = await todosService.search({
      populate: [new PopulateOne({ localField: 'user', from: 'users' })],
    });

    expect(res).toBeDefined();
    expect(res.data[0].user).toBeDefined();
  });

  it('should add todo', async () => {
    const todo = {
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
    };

    const todoInDb = await todosService.create(todo);

    expect(todoInDb).toBeDefined();
    expect(todoInDb.id).toBeDefined();
    expect(todoInDb.name).toEqual(todo.name);
    expect(todoInDb.description).toEqual(todo.description);
    expect(todoInDb.type).toEqual('todo');
  });

  it('should list all todos', async () => {
    const todo = {
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
    };

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

  it('should search todos', async () => {
    const todo = {
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet.',
    };

    const promises = [];

    for (let counter = 1; counter <= 3; counter++) {
      const todoToAdd = {
        ...todo,
        name: todo.name + counter,
        description: todo.description + (counter + 1),
      };
      promises.push(todosService.create(todoToAdd));
    }

    await Promise.all(promises);

    const searchedTodos = await todosService.search({
      params: {
        search: new TodoSearch({
          nameOrDescription: new FilterOr('nameOrDescription', [
            new FilterLike('description', '2'),
            new FilterLike('name', '2'),
          ]),
        }),
      },
      populate: [new PopulateOne({ localField: 'user', from: 'users' })],
    });

    expect(searchedTodos).toBeDefined();
    expect(searchedTodos.total).toEqual(2);
    expect(searchedTodos.data.length).toEqual(searchedTodos.total);
  });

  it('should get filtered todos', async () => {
    const user1 = await usersService.create({
      name: 'carlos',
      email: 'carlos.miguel@email.com',
      password: '123',
    });

    const todo1 = {
      name: 'My Todo 1',
      description: 'Lorem ipsum sit dolor amet',
      user:  new Types.ObjectId(user1.id),
    };

    const todo2 = {
      name: 'My Todo 2',
      description: 'Lorem ipsum sit dolor amet',
    };

    const todo3 = {
      name: 'My Todo 3',
      description: 'Lorem ipsum sit dolor amet',
    };

    await Promise.all([
      todosService.create(todo1),
      todosService.create(todo2),
      todosService.create(todo3),
    ]);

    const todosInDb = await todosService.search({
      params: {
        filter: new TodoFilters({
          username: new FilterLike('user.name', 'carlos'),
        }),
      },
      populate: [new PopulateOne({ localField: 'user', from: 'users' })],
    });

    expect(todosInDb).toBeDefined();
    expect(todosInDb.total).toEqual(1);
    expect(todosInDb.data.length).toEqual(todosInDb.total);
  });

  it('should get todo by id', async () => {
    const todo = {
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
    };

    const addedTodo = await todosService.create(todo);
    expect(addedTodo).toBeDefined();
    expect(addedTodo.id).toBeDefined();

    const todoInDb = await todosService.get(addedTodo.id);
    expect(todoInDb).toBeDefined();
    expect(todoInDb.id).toEqual(addedTodo.id);
  });

  it('should update todo', async () => {
    const todo = {
      name: 'My Todo',
      description: 'Lorem ipsum sit dolor amet',
    };

    const addedTodo = await todosService.create(todo);
    expect(addedTodo).toBeDefined();
    expect(addedTodo.id).toBeDefined();
    expect(addedTodo.createdAt).toBeDefined();
    expect(addedTodo.updatedAt).toBeDefined();

    addedTodo.name = 'Updated todo';

    const updateTodo = await todosService.update(addedTodo.id, addedTodo);

    expect(updateTodo).toBeDefined();
    expect(updateTodo.id).toBeDefined();
    expect(updateTodo.id).toEqual(addedTodo.id);
    expect(updateTodo.createdAt).toBeDefined();
    expect(updateTodo.updatedAt).toBeDefined();
    expect(updateTodo.createdAt).toEqual(addedTodo.createdAt);
    expect(updateTodo.updatedAt).not.toEqual(addedTodo.updatedAt);
  });
});
