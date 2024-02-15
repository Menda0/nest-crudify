import { Model, Types } from 'mongoose';
import {
  CommonService,
  EntityNotFoundException,
  PopulateOptions,
  RelationType,
  SearchParams,
  SearchResponse,
} from 'nestjs-crudify';
import { MongoAggsBuilder } from './MongoAggsBuilder';
import { MongoDto, MongoDtoFactory } from './MongoDto';

export class PopulateOne extends PopulateOptions {
  constructor(from: string, type: string) {
    super(type, from, '_id', from, RelationType.ONE);
  }

  override getOperations(): any[] {
    return [
      {
        $lookup: {
          from: this.from,
          localField: this.localField,
          foreignField: this.foreignField,
          as: this.as,
        },
      },
      {
        $unwind: {
          path: `$${this.localField}`,
          includeArrayIndex: 'id',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }
}

export class PopulateMany extends PopulateOptions {
  constructor(from: string, type: string) {
    super(type, from, '_id', from, RelationType.MANY);
  }

  override getOperations(): any[] {
    return [
      {
        $lookup: {
          from: this.from,
          localField: this.localField,
          foreignField: this.foreignField,
          as: this.as,
        },
      },
    ];
  }
}

export class MongoService<Entity, Dto extends MongoDto>
  implements CommonService<string, Dto>
{
  constructor(
    protected readonly repository: Model<Entity>,
    protected readonly dtoFactory: MongoDtoFactory<Entity, Dto>
  ) {}

  private async count(operation: any) {
    const [{ count } = { count: 0 }] = await this.repository
      .aggregate(operation, { allowDiskUse: true })
      .count('count');
    return count;
  }

  async create(data: Omit<Entity, '_id' | 'createdAt' | 'updatedAt'>) {
    data = { ...data, id: undefined };

    const entity = await this.repository.create(data);

    return this.dtoFactory.create(entity);
  }

  async search(options?: {
    params?: SearchParams;
    populate: PopulateOptions[];
  }) {
    const { params, populate = [] } = options ?? {};

    const operation = new MongoAggsBuilder();

    for (const relation of populate) {
      operation.withPopulate(relation);
    }

    const filters = params?.filter?.getIterator();

    while (filters?.hasNext()) {
      const filter = filters?.next();

      if (filter) {
        operation.withFilter(filter);
      }
    }

    const countOperation = this.count(operation.build());

    if (params?.sort) {
      operation.withSort(params?.sort);
    }

    if (
      params?.page &&
      params.page.number != undefined &&
      params.page.size != undefined
    ) {
      const { number, size } = params.page;
      const limit = size;
      const offset = (number - 1) * limit;

      operation.withOffset(offset).withLimit(limit);
    }

    const searchOpearation = this.repository
      .aggregate<Entity>(operation.build())
      .exec();

    const [total, result] = await Promise.all([
      countOperation,
      searchOpearation,
    ]);

    const data = result.map((e) => this.dtoFactory.create(e));

    return new SearchResponse(data, total, params?.page);
  }

  async get(id: string, populate?: PopulateOptions[]) {
    const query = this.repository
      .findById(new Types.ObjectId(id))
      .populate(populate?.map((p) => p.from) ?? []);

    const entity = (await query.exec()) as Entity;

    if (entity) {
      return this.dtoFactory.create(entity);
    } else {
      throw new EntityNotFoundException(this.repository.modelName, id);
    }
  }

  async delete(id: string) {
    const entity = this.get(id);

    await this.repository
      .deleteOne({
        _id: new Types.ObjectId(id),
      })
      .exec();

    return entity;
  }

  async update(id: string, data: any) {
    if (id) {
      await this.repository
        .findByIdAndUpdate(new Types.ObjectId(id), { ...data })
        .exec();
      return this.get(id);
    } else {
      throw new EntityNotFoundException(this.repository.modelName, id);
    }
  }
}
