import { Logger } from '@nestjs/common';
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
import { MongoDto, MongoFactory } from './MongoDto';

type TPopulateOptions = {
  from: string;
  localField: string;
  fk?: string;
  as?: string;
};

export class PopulateOne extends PopulateOptions {
  constructor({ from, localField, fk = '_id', as }: TPopulateOptions) {
    super(from, localField, fk, as ?? localField, RelationType.ONE);
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
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }
}

export class PopulateMany extends PopulateOptions {
  constructor({ from, localField, fk = '_id', as }: TPopulateOptions) {
    super(from, localField, fk, as ?? localField, RelationType.MANY);
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
  private readonly logger = new Logger();

  constructor(
    protected readonly repository: Model<Entity>,
    protected readonly factory: MongoFactory<Entity, Dto>
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

    return this.factory.createDto(entity);
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
      params?.page?.number != undefined ||
      params?.page?.size != undefined ||
      params?.page?.offset != undefined ||
      params?.page?.limit != undefined
    ) {
      const { number, size, offset, limit } = params.page;

      if (number != undefined && size != undefined) {
        const limit = size;
        const offset = (number - 1) * limit;

        operation.withOffset(offset).withLimit(limit);
      } else if (offset != undefined && limit != undefined) {
        operation.withOffset(offset).withLimit(limit);
      } else {
        this.logger.warn(
          'Please provide a valid combination for pagination. Either number/size OR offset/limit'
        );
        operation.withStep({
          $match: {
            _id: null, // * Assuming no document in your collection has _id set to null
          },
        });
      }
    }

    const searchOperation = this.repository
      .aggregate<Entity>(operation.build())
      .exec();

    const [total, result] = await Promise.all([
      countOperation,
      searchOperation,
    ]);

    const data = result.map((e) => this.factory.createDto(e));

    return new SearchResponse(data, total, params?.page);
  }

  async get(id: string, populate?: PopulateOptions[]) {
    const query = this.repository
      .findById(new Types.ObjectId(id))
      .populate(populate?.map((p) => p.from) ?? []);

    const entity = (await query.exec()) as Entity;

    if (entity) {
      return this.factory.createDto(entity);
    } else {
      throw new EntityNotFoundException(this.repository.modelName, id);
    }
  }

  async delete(id: string) {
    const entity = this.get(id);

    if (!entity) {
      throw new EntityNotFoundException(this.repository.modelName, id);
    }

    await this.repository
      .deleteOne({
        _id: new Types.ObjectId(id),
      })
      .exec();

    return entity;
  }

  async update(id: string, data: any, options?: any) {
    if (id) {
      await this.repository
        .findByIdAndUpdate(new Types.ObjectId(id), { ...data }, options)
        .exec();
      return this.get(id);
    } else {
      throw new EntityNotFoundException(this.repository.modelName, id);
    }
  }
}
