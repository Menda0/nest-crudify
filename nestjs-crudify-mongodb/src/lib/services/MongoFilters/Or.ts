import { CommonFilter } from 'nestjs-crudify';

type TFilterOrStructure<T> = {
  $or: T[] | undefined;
};

export class FilterOr<T> extends CommonFilter<
  CommonFilter<T, any>[],
  TFilterOrStructure<T>
> {
  getFilter(): TFilterOrStructure<T> {
    return {
      $or: this.value ? this.value.map((filter) => filter.getFilter()) : [],
    };
  }
}
