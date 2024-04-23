import {
  ClassConstructor,
  Expose,
  Type,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { CommonDto, Factory } from 'nestjs-crudify';

export class MongoDto extends CommonDto {
  @Expose({ name: '_id' })
  @Type(() => String)
  public id?: string;

  constructor(type: string, relationshipNames?: Array<string>) {
    super(type, relationshipNames);
  }
}

export abstract class MongoFactory<Entity, Dto extends MongoDto>
  implements Factory<Entity, Dto>
{
  constructor(
    private entityConstructor: ClassConstructor<Entity>,
    private classConstructor: ClassConstructor<Dto>
  ) {}

  create(entity: Entity): Dto {
    return plainToInstance(this.classConstructor, entity, {
      excludeExtraneousValues: true,
    });
  }

  createEntity(dto: Dto): Entity {
    // Assuming Entity has a similar structure to Dto and a constructor that accepts similar parameters
    const entity = plainToClass(this.entityConstructor, {
      ...dto,
      id: dto.id ? dto.id : undefined,
    });
    return entity;
  }

  createDto(entity: Entity): Dto {
    return plainToInstance(this.classConstructor, entity, {
      excludeExtraneousValues: true,
    });
  }
}
