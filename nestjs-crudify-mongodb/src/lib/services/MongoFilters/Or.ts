import { CommonFilter } from 'nestjs-crudify';

type TFilterOrStructure<T> = {
  $or: T[] | undefined;
};

export class FilterOr<T> extends CommonFilter<
  CommonFilter<T, any>[],
  TFilterOrStructure<T>
> {
  getFilter(): TFilterOrStructure<T> {
    // TODO[cami]: Mongo does not like when empty array is used as a value for $and / $or / $nor filters
    return {
      $or: this.value ? this.value.map((filter) => filter.getFilter()) : [],
    };
  }
}
