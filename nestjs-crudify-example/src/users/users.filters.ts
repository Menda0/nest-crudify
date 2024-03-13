import { Types } from 'mongoose';
import { SearchFilters, TransformToFilter, parseValues } from 'nestjs-crudify';
import {
  FilterLike,
  FilterMatchIn,
  FilterOr,
  parseObjectId,
} from 'nestjs-crudify-mongodb';

export class UserFilters extends SearchFilters {
  @TransformToFilter<Types.ObjectId[]>(new FilterMatchIn('_id'), (v) =>
    parseValues(v, parseObjectId)
  )
  id: FilterMatchIn<Types.ObjectId[]>;

  @TransformToFilter<string>(new FilterLike('name'))
  name: FilterLike;

  @TransformToFilter<string>(new FilterLike('email'))
  email: FilterLike;

  @TransformToFilter<any>(new FilterOr('nameOrEmail'), (v) => {
    return [new FilterLike('name', v), new FilterLike('email', v)];
  })
  nameOrEmail: FilterOr<any>;
}

export class UserSearch extends SearchFilters {
  @TransformToFilter<any>(new FilterOr('nameOrEmail'), (v) => {
    return [new FilterLike('name', v), new FilterLike('email', v)];
  })
  nameOrEmail: FilterOr<any>;
}
