import { CommonFilter } from 'nestjs-crudify';

type TFilterMatchInStructure<T> = {
  $match: { [key: string]: { $in: T[] | undefined } };
};

export class FilterMatchIn<T> extends CommonFilter<
  T[],
  TFilterMatchInStructure<T>
> {
  getFilter(): TFilterMatchInStructure<T> {
    return {
      $match: { [this.name]: { $in: this.value } },
    };
  }
}
