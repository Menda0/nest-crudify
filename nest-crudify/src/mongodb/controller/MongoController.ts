import {CommonController, MongoDto, MongoService} from 'nest-crudify';

export class MongoController<Dto extends MongoDto, Service extends MongoService<any, Dto, any>> extends CommonController<string, Dto, Service>{

}
