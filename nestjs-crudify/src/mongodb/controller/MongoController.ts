import { CommonController } from '../../commons';
import { MongoDto, MongoService } from '../services';

export class MongoController<
  Dto extends MongoDto,
  Service extends MongoService<any, Dto>
> extends CommonController<string, Dto, Service> {}
