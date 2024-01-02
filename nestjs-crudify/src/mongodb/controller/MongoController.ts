import {MongoDto, MongoService} from '../services';
import {CommonController} from '../../commons';

export class MongoController<Dto extends MongoDto, Service extends MongoService<any, Dto, any>> extends CommonController<string, Dto, Service>{}
