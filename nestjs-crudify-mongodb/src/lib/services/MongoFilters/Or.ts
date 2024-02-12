import { CommonFilter } from 'nestjs-crudify';

type TFilterOrStructure<T> = {
  $match: {
    $or: T[] | undefined;
  };
};

export class FilterOr<T> extends CommonFilter<
  CommonFilter<T, any>[],
  TFilterOrStructure<T>
> {
  getFilter(): TFilterOrStructure<T> {
    return {
      $match: {
        $or: this.value?.map((filter) => filter.getFilter()),
      },
    };
  }
}
