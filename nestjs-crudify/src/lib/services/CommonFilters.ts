import {TransformToNumber} from '../pipes';

export interface Filter<Input, Result> {
  name: string
  getFilter(): Result
}

export abstract class CommonFilter<Input, Result>  implements Filter<Input, Result>{
  value?: Input
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract getFilter(): Result
}

export class SearchFiltersIterator {
  private keys: string[]
  private index: number

  constructor(private searchFilters: any) {
    this.keys = Object.keys(searchFilters)
    this.index = 0
  }
  hasNext(){
    return this.keys.length > this.index
  }
  next(): Filter<any, any> {
    if (!this.hasNext()) {
      throw new Error("No more elements in iterator");
    }

    const filterKey = this.keys[this.index]
    this.index++
    return this.searchFilters[filterKey]
  }
}

export abstract class SearchFilters{
  getIterator(){
    return new SearchFiltersIterator(this)
  }
}

export class Page {
  @TransformToNumber()
  number!: number;
  @TransformToNumber()
  size!: number;
};

export type SearchParams = {
  page?: Page;
  sort?: string;
  search?: string;
  filter?: SearchFilters;
};
