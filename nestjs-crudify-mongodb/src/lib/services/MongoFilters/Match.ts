import { CommonFilter } from 'nestjs-crudify';

type TFilterMatchStructure<T> = {
  [key: string]: T | undefined;
};

export class FilterMatch<T> extends CommonFilter<T, TFilterMatchStructure<T>> {
  getFilter(): TFilterMatchStructure<T> {
    return {
      [this.name]: this.value,
    };
  }
}
