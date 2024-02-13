import { CommonFilter } from 'nestjs-crudify';

type TFilterAndStructure<T> = {
  $and: T[] | undefined;
};

export class FilterAnd<T> extends CommonFilter<
  CommonFilter<T, any>[],
  TFilterAndStructure<T>
> {
  getFilter(): TFilterAndStructure<T> {
    // TODO[cami]: Mongo does not like when empty array is used as a value for $and / $or / $nor filters
    return {
      $and: this.value ? this.value.map((filter) => filter.getFilter()) : [],
    };
  }
}
