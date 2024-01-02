import {TodosService} from './todos.service';
import {TestingModuleBuilder} from 'nestjs-crudify';
import {TodosModule} from './todos.module';
import {TodoDto} from './todos.dto';
import mongoose from "mongoose"

describe('TodosService', () => {
  let service: TodosService;
  let moduleBuilder: TestingModuleBuilder

  beforeEach(async () => {
    moduleBuilder = new TestingModuleBuilder()
      .withMongoInMemory()
      .withImports(TodosModule)

    await moduleBuilder.build()

    service = moduleBuilder.module.get<TodosService>(TodosService);
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await moduleBuilder.mongoServer.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add todo', async () => {
    const todo = new TodoDto({
        name: "My Todo",
        description: "Lorem ipsum sit dolor amet",
      },
    )

    const todoInDb = await service.create(todo)

    expect(todoInDb).toBeDefined()
    expect(todoInDb.id).toBeDefined()
    expect(todoInDb.name).toEqual(todo.name)
    expect(todoInDb.description).toEqual(todo.description)
    expect(todoInDb.type).toEqual("todo")
  })

  it('should list all todos', async () => {
    const todo = new TodoDto({
        name: "My Todo",
        description: "Lorem ipsum sit dolor amet",
      },
    )

    await Promise.all([service.create(todo), service.create(todo), service.create(todo)])

    const todosInDb = await service.search()

    expect(todosInDb).toBeDefined()
    expect(todosInDb.total).toEqual(3)
    expect(todosInDb.data.length).toEqual(todosInDb.total)
  })

  it('should get todo by id', async () => {
    const todo = new TodoDto({
        name: "My Todo",
        description: "Lorem ipsum sit dolor amet",
      },
    )

    const addedTodo = await service.create(todo)
    expect(addedTodo).toBeDefined()
    expect(addedTodo.id).toBeDefined()

    const todoInDb = await service.get(addedTodo.id)
    expect(todoInDb).toBeDefined()
    expect(todoInDb.id).toEqual(addedTodo.id)
  })

  it("should update todo",async () => {
    const todo = new TodoDto({
        name: "My Todo",
        description: "Lorem ipsum sit dolor amet",
      },
    )

    const addedTodo = await service.create(todo)
    expect(addedTodo).toBeDefined()
    expect(addedTodo.id).toBeDefined()
    expect(addedTodo.createdAt).toBeDefined()
    expect(addedTodo.updateAt).toBeDefined()

    addedTodo.name = "Updated todo"

    const updateTodo = await service.update(addedTodo.id, addedTodo)

    expect(updateTodo).toBeDefined()
    expect(updateTodo.id).toBeDefined()
    expect(updateTodo.id).toEqual(addedTodo.id)
    expect(updateTodo.createdAt).toBeDefined()
    expect(updateTodo.updateAt).toBeDefined()
    expect(updateTodo.createdAt).toEqual(addedTodo.createdAt)
    expect(updateTodo.updateAt).not.toEqual(addedTodo.updateAt)
  })
});
