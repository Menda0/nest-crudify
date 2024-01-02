import {CommonFilter} from '../../commons';

export class FilterMatch<T> extends CommonFilter<T, any> {
  getFilter(): any {
    return {
      $match: {[this.name]:this.value}
    };
  }
}

export class FilterMatchIn<T> extends CommonFilter<T, any>{
  getFilter(): any {
    return {
      $match: {[this.name]: {$in: this.value}}
    };
  }
}

export class FilterLike extends CommonFilter<string, any>{
  override getFilter(): any {
    return {
      $match: {
        [this.name]: { $regex: this.value, $options: 'i' }
      }
    }
  }
}
