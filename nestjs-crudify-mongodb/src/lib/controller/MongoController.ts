import { CommonController } from 'nestjs-crudify';
import { MongoDto, MongoService } from '../services';

export class MongoController<
  Dto extends MongoDto,
  Service extends MongoService<any, Dto>
> extends CommonController<string, Dto, Service> {}
