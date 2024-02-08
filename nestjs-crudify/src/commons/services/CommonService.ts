import { CommonDto } from './CommonDto';
import { Page, SearchParams } from './CommonFilters';

export class SearchResponse<Id, Dto> {
  data: Dto[];
  total: number;
  page?: Page;

  constructor(data: Dto[], total: number, page?: Page) {
    this.data = data;
    this.total = total;
    this.page = page;
  }
}

export interface CommonService<Id, DTO extends CommonDto<Id>> {
  search(params?: SearchParams): Promise<SearchResponse<Id, DTO>>;
  create(data: any): Promise<DTO>;
  get(id: string): Promise<DTO>;
  delete(id: string): Promise<DTO>;
  update(id: Id, data: any): Promise<DTO>;
}
