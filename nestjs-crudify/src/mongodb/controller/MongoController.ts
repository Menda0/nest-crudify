export class MongoController<
  Dto extends MongoDto,
  Service extends MongoService<any, Dto>
> extends CommonController<string, Dto, Service> {}
