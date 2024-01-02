import {CommonDto} from './CommonDto';
import {SearchParams} from './CommonFilters';

export type SearcResponse<Id, Dto> = {
  data: Dto[],
  total: number
}

export interface CommonService<Id, DTO extends CommonDto<Id>>{
  search(params?: SearchParams): Promise<SearcResponse<Id, DTO>>;
  create(data: any): Promise<DTO>
  get(id: string): Promise<DTO>
  delete(id: string): Promise<DTO>
  update(id: string, data: any): Promise<DTO>
}
