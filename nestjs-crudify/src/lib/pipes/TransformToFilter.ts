import { Transform } from 'class-transformer';
import { CommonFilter } from '../services';

export function parseValues<T>(values: string, parser: (v: any) => T) {
  return values.split(',').map((e) => parser(e));
}

export const TransformToFilter = <T>(
  filter: CommonFilter<any, any>,
  parser?: (v: any) => T
) => {
  return Transform(({ value }) => {
    if (parser) {
      filter.setValue(parser(value));
    } else {
      filter.setValue(value);
    }

    /** 
     * filter[aOrb]=carlos
     * 
     * 
    */

    return filter;
  });
};
