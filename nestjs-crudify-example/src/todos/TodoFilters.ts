import { Types } from 'mongoose';
import { SearchFilters, TransformToFilter, parseValues } from 'nestjs-crudify';
import {
  FilterLike,
  FilterMatch,
  FilterMatchIn,
  parseObjectId,
} from 'nestjs-crudify-mongodb';

export class TodoFilters extends SearchFilters {
  @TransformToFilter<Types.ObjectId[]>(new FilterMatchIn('_id'), (v) =>
    parseValues(v, parseObjectId)
  )
  id: FilterMatchIn<Types.ObjectId[]>;
  @TransformToFilter<string>(new FilterMatch('name'))
  name: FilterLike;
  @TransformToFilter<string>(new FilterLike('description'))
  description: FilterLike;
}
