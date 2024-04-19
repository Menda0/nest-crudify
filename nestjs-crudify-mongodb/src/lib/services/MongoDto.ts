import { CommonDto, Factory } from 'nestjs-crudify';
import {ClassConstructor, Expose, plainToInstance, Type} from 'class-transformer';

export class MongoDto extends CommonDto {
  @Expose({name: "_id"})
  @Type(() => String)
  public id?: string;

  constructor(type: string, relationshipNames?: Array<string>) {
    super(type, relationshipNames);
  }
}

export abstract class MongoFactory<Entity, Dto extends MongoDto>
  implements Factory<Entity, Dto> {

  constructor(private classConstructor: ClassConstructor<Dto>) {}

  create(entity: Entity): Dto {
    return plainToInstance(this.classConstructor, entity, { excludeExtraneousValues: true });
  }
}
