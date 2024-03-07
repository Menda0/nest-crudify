import { TransformToNumber } from '../pipes';

export interface Filter<ValueType, FilterStructure> {
  name: string;
  value?: ValueType;
  getFilter(): FilterStructure;
}

export abstract class CommonFilter<ValueType, FilterStructure>
  implements Filter<ValueType, FilterStructure>
{
  name: string;
  value?: ValueType;

  constructor(name: string, value?: ValueType) {
    this.name = name;
    this.value = value;
  }

  abstract getFilter(): FilterStructure;

  setValue(value: ValueType) {
    this.value = value;
  }
}

export class SearchFiltersIterator {
  private keys: string[];
  private index: number;

  constructor(private searchFilters: any) {
    this.keys = Object.keys(searchFilters);
    this.index = 0;
  }
  hasNext() {
    return this.keys.length > this.index;
  }
  next(): Filter<any, any> {
    if (!this.hasNext()) {
      throw new Error('No more elements in iterator');
    }

    const filterKey = this.keys[this.index];
    this.index++;
    return this.searchFilters[filterKey];
  }
}

export abstract class SearchFilters {
  getIterator() {
    return new SearchFiltersIterator(this);
  }
}

export class Page {
  @TransformToNumber(1)
  number?: number;
  @TransformToNumber(10)
  size?: number;

  @TransformToNumber(0)
  offset?: number;
  @TransformToNumber(10)
  limit?: number;
}

export type SearchParams = {
  page?: Page;
  sort?: string;
  search?: string;
  filter?: SearchFilters;
};
