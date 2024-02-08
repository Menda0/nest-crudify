import {
  CommonDto,
  CommonService,
  Page,
  PopulateOptions,
  SearchFilters,
  SearchParams,
} from '../services';

export class CommonController<
  Id,
  Dto extends CommonDto<Id>,
  Service extends CommonService<Id, Dto>
> {
  constructor(protected service: Service) {}

  async _create(body: Dto) {
    return this.service.create(body);
  }

  async _update(id: Id, body: Dto) {
    return this.service.update(id, body);
  }

  async _search(
    sort?: string,
    search?: string,
    page?: Page,
    filter?: SearchFilters,
    populate?: PopulateOptions[]
  ) {
    const params: SearchParams = {
      sort,
      search,
      page,
      filter,
    };

    return this.service.search({ params, populate });
  }

  _delete(id: string) {
    return this.service.delete(id);
  }
}

export interface CommonCrudController<Dto extends CommonDto<any>> {
  create(body: Dto): Promise<Dto>;
}
