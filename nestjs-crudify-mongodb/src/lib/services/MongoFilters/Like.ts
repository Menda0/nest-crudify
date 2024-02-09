import { CommonFilter } from 'nestjs-crudify';

type TFilterLikeStructure<T> = {
  $match: {
    [key: string]: { $regex: T | undefined; $options: 'i' };
  };
};

export class FilterLike extends CommonFilter<
  string,
  TFilterLikeStructure<string>
> {
  getFilter(): TFilterLikeStructure<string> {
    return {
      $match: {
        [this.name]: { $regex: this.value, $options: 'i' },
      },
    };
  }
}
