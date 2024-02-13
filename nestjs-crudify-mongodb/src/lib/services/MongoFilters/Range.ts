import { CommonFilter } from 'nestjs-crudify';

abstract class RangeFilter<T, Structure> extends CommonFilter<T, Structure> {
  protected abstract getOperator(): string;

  getFilter() {
    const operator = this.getOperator();

    return {
      [this.name]: {
        [operator]: this.value,
      },
    } as Structure;
  }
}

type TGreaterThanStructure<T> = { [key: string]: { $gt: T | undefined } };

export class FilterGreaterThan<T> extends RangeFilter<
  T,
  TGreaterThanStructure<T>
> {
  protected getOperator(): string {
    return '$gt';
  }
}

type TGreaterOrEqualThanStructure<T> = {
  [key: string]: { $gte: T | undefined };
};

export class FilterGreaterOrEqualThan<T> extends RangeFilter<
  T,
  TGreaterOrEqualThanStructure<T>
> {
  protected getOperator(): string {
    return '$gte';
  }
}

type TLessThanStructure<T> = { [key: string]: { $lt: T | undefined } };

export class FilterLessThan<T> extends RangeFilter<T, TLessThanStructure<T>> {
  protected getOperator(): string {
    return '$lt';
  }
}

type TLessOrEqualThanStructure<T> = { [key: string]: { $lte: T | undefined } };

export class FilterLessOrEqualThan<T> extends RangeFilter<
  T,
  TLessOrEqualThanStructure<T>
> {
  protected getOperator(): string {
    return '$lte';
  }
}
