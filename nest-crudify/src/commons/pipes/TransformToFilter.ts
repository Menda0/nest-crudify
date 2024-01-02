import {Transform} from 'class-transformer';
import {CommonFilter} from 'nest-crudify';

export function parseValues<T>(values: string, parser: (v: any) => T) {
  return values.split(",").map(e => parser(e))
}

export const TransformToFilter = <T>(filter: CommonFilter<any, any>, parser?: (v: any) => T) => {
  return Transform(({ value }) => {
    if(parser){
      filter.value = parser(value)
    }else{
      filter.value = value
    }

    return filter
  })
}
