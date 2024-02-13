import { CommonFilter } from 'nestjs-crudify';

type TFilterBetweenStructure<T> = {
  [key: string]: {
    $gte: T | undefined;
    $lte: T | undefined;
  };
};

export class FilterBetween<T> extends CommonFilter<
  [T, T],
  TFilterBetweenStructure<T>
> {
  getFilter(): TFilterBetweenStructure<T> {
    const [start, end] = this.value ?? [];

    return {
      [this.name]: {
        $gte: start,
        $lte: end,
      },
    };
  }
}
