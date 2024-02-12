import cloneDeep from 'lodash/cloneDeep';
import { Filter, PopulateOptions } from 'nestjs-crudify';

export class MongoAggsBuilder {
  public pipeline: any[] = [{ $match: {} }];

  withStep(step: any) {
    this.pipeline.push(step);

    return this;
  }

  withFilter(filter: Filter<any, any>) {
    this.pipeline.push({ $match: filter.getFilter() });

    return this;
  }

  withLimit(limit: number) {
    this.pipeline.push({ $limit: limit });

    return this;
  }

  withOffset(offset: number) {
    this.pipeline.push({ $skip: offset });

    return this;
  }

  getSort(criteria: string) {
    let order;
    let field;
    if (criteria.startsWith('-')) {
      order = -1;
      field = criteria.slice(1, criteria.length);
    } else {
      order = 1;
      field = criteria;
    }
    return { [field]: order };
  }

  withSort(sort: string) {
    // Applied sort to multiple criteria
    if (sort.includes(',')) {
      const criterias = sort.split(',');
      let $sort = {};
      for (const criteria of criterias) {
        $sort = { ...$sort, ...this.getSort(criteria) };
      }
      this.pipeline.push({ $sort });
    } else {
      this.pipeline.push({ $sort: this.getSort(sort) });
    }

    return this;
  }

  withPopulate(populate: PopulateOptions) {
    this.pipeline = [...this.pipeline, ...populate.getOperations()];

    return this;
  }

  build() {
    return cloneDeep(this.pipeline);
  }
}
