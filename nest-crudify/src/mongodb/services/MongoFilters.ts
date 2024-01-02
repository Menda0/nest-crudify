import {Filter} from '../../commons';

export abstract class FilterMongo<T> implements Filter<T, any>{
  value: T
  name: string;

  constructor(name: string, value: T) {
    this.name = name
    this.value = value
  }

  abstract getFilter(): any
}

export class FilterMatch<T> extends FilterMongo<T>{
  getFilter(): any {
    return {
      $match: {[this.name]:this.value}
    };
  }
}

export class FilterMatchIn<T> extends FilterMongo<T[]>{
  getFilter(): any {
    return {
      $match: {[this.name]: {$in: this.value}}
    };
  }
}

export class FilterLike extends FilterMongo<string>{
  override getFilter(): any {
    return {
      $match: {
        [this.name]: { $regex: this.value, $options: 'i' }
      }
    }
  }
}
