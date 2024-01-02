
export interface Filter<Input, Result> {
  name: string
  getFilter(): Result
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

export type Page = {
  offset: number;
  limit: number;
};

export type SearchParams = {
  page?: Page;
  sort?: string;
  search?: string;
  filters?: SearchFilters;
};
