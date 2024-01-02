import {Model, Types} from 'mongoose';
import {MongoAggsBuilder} from './MongoAggsBuilder';
import {MongoDto, MongoDtoFactory} from './MongoDto';
import {SearchParams, CommonService, EntityNotFoundException, SearcResponse} from '../../commons';

export class MongoService<Entity, Dto extends MongoDto, Filters> implements CommonService<string, Dto>
{
  constructor(
    protected readonly repository: Model<Entity>,
    protected readonly factory: MongoDtoFactory<Entity, Dto>
  ) {}

  private async count(operation: any) {
    const [{ count } = { count: 0 }] = await this.repository
      .aggregate(operation, { allowDiskUse: true })
      .count('count');
    return count;
  }

  async create(data: any) {
    data.id = undefined;

    const entity = await this.repository.create({ ...data });
    return this.factory.create(entity);
  }

  async search(params?: SearchParams){
    const operation = new MongoAggsBuilder()

    const filters = params?.filter?.getIterator()

    while(filters?.hasNext()){
      const filter = filters?.next()
      operation.withFilter(filter)
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
      const {number, size} = params.page
      const limit = size
      const offset = (number-1) * limit

      operation.withOffset(offset).withLimit(limit);
    }

    const searchOpearation = this.repository
      .aggregate<Entity>(operation.build())
      .exec();

    const [total, result] = await Promise.all([countOperation, searchOpearation])

    const data = result.map(e => this.factory.create(e))

    return new SearcResponse(
      data,
      total,
      params?.page
    )
  }

  async get(id: string) {
    let query = this.repository.findById(new Types.ObjectId(id));

    const entity = await query.exec();

    if (entity) {
      return this.factory.create(entity);
    } else {
      throw new EntityNotFoundException(this.repository.modelName, id)
    }
  }

  async delete(id: string) {
    const entity = this.get(id);
    const response = await this.repository
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
      throw new EntityNotFoundException(this.repository.modelName, id)
    }
  }
}
