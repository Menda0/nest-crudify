import { CommonDto, Factory } from 'nestjs-crudify';

export class MongoDto extends CommonDto<string> {
  constructor(type: string, relationshipNames?: Array<string>) {
    super(type, relationshipNames);
  }
}

export interface MongoFactory<Entity, Dto extends MongoDto>
  extends Factory<Entity, string, Dto> {}
