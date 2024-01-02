import {CommonDto, CommonService} from 'nest-crudify';

export class CommonController<Id, Dto extends CommonDto<Id>,Service extends CommonService<Id, Dto>>{
  constructor(
    protected service: Service,
  ) {}

  async _create(body: Dto) {
    return this.service.create(body);
  }
}

export interface CommonCrudController<Dto extends CommonDto<any>>{
  create(body: Dto): Promise<Dto>
}
