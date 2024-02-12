import { CommonFilter } from 'nestjs-crudify';

type TFilterMatchInStructure<T> = {
  [key: string]: { $in: T[] | undefined };
};

export class FilterMatchIn<T> extends CommonFilter<
  T[],
  TFilterMatchInStructure<T>
> {
  getFilter(): TFilterMatchInStructure<T> {
    return {
      [this.name]: { $in: this.value },
    };
  }
}
