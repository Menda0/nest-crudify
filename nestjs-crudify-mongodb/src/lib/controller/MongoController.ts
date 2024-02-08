import {MongoDto, MongoService} from '../services';
import {CommonController} from 'nestjs-crudify';

export class MongoController<Dto extends MongoDto, Service extends MongoService<any, Dto>> extends CommonController<string, Dto, Service>{}
