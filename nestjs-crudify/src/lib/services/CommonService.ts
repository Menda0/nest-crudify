import { CommonDto } from './CommonDto';
import { Page, SearchParams } from './CommonFilters';

export enum RelationType {
  ONE,
  MANY,
}
export abstract class PopulateOptions {
  constructor(
    public from: string,
    public localField: string,
    public foreignField: string,
    public as: string,
    public relationType: RelationType
  ) {}

  abstract getOperations(): any[];
}

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

type SearchOptions = {
  params?: SearchParams;
  populate?: PopulateOptions[];
};

export interface CommonService<Id, DTO extends CommonDto<Id>> {
  search(options?: SearchOptions): Promise<SearchResponse<Id, DTO>>;
  create(data: any): Promise<DTO>;
  get(id: string): Promise<DTO>;
  delete(id: string): Promise<DTO>;
  update(id: Id, data: any): Promise<DTO>;
}
