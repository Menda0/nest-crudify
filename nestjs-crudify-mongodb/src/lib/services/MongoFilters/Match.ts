import { CommonFilter } from 'nestjs-crudify';

type TFilterMatchStructure<T> = {
  $match: { [key: string]: T | undefined };
};

export class FilterMatch<T> extends CommonFilter<T, TFilterMatchStructure<T>> {
  getFilter(): TFilterMatchStructure<T> {
    return {
      $match: { [this.name]: this.value },
    };
  }
}
