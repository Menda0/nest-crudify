import { SearchFilters } from 'nestjs-crudify';
import {
  FilterAnd,
  FilterBetween,
  FilterGreaterThan,
  FilterLessThan,
  FilterLike,
  FilterMatch,
  FilterMatchIn,
  FilterOr,
  MongoAggsBuilder,
} from '../services';

describe('Testing MongoAggsBuilder', () => {
  let builder: MongoAggsBuilder;

  beforeEach(async () => {
    builder = new MongoAggsBuilder();
  });

  it('should be able to add a match filter"', () => {
    const matchFilter = new FilterMatch<string>('filter1', 'this is a test');

    const query = builder.withFilter(matchFilter).build();

    const expectedResult = [
      { $match: {} },
      {
        $match: { filter1: 'this is a test' },
      },
    ];

    expect(query).toEqual(expectedResult);
  });

  it('should be able to add a match in filter"', () => {
    const matchInFilter = new FilterMatchIn<string>('filter1', [
      'this is a test',
    ]);

    const query = builder.withFilter(matchInFilter).build();

    const expectedResult = [
      { $match: {} },
      {
        $match: { filter1: { $in: ['this is a test'] } },
      },
    ];

    expect(query).toEqual(expectedResult);
  });

  it('should be able to add a match like', () => {
    const matchFilter = new FilterLike('filter1', 'this is a test');

    const query = builder.withFilter(matchFilter).build();

    const expectedResult = [
      { $match: {} },
      {
        $match: { filter1: { $regex: 'this is a test', $options: 'i' } },
      },
    ];

    expect(query).toEqual(expectedResult);
  });

  it('should be able to add an or filter', () => {
    const orFilter = new FilterOr('orFilter', [
      new FilterLike('filterLike1', 'like'),
      new FilterLike('filterLike2', 'like'),
    ]);

    const query = builder.withFilter(orFilter).build();

    const expectedResult = [
      { $match: {} },
      {
        $match: {
          $or: [
            { filterLike1: { $regex: 'like', $options: 'i' } },
            { filterLike2: { $regex: 'like', $options: 'i' } },
          ],
        },
      },
    ];

    expect(query).toEqual(expectedResult);
  });

  it('should be able to add an and filter', () => {
    const andFilter = new FilterAnd('andFilter', [
      new FilterLike('filterLike1', 'like'),
      new FilterLike('filterLike2', 'like'),
    ]);

    const query = builder.withFilter(andFilter).build();

    const expectedResult = [
      { $match: {} },
      {
        $match: {
          $and: [
            { filterLike1: { $regex: 'like', $options: 'i' } },
            { filterLike2: { $regex: 'like', $options: 'i' } },
          ],
        },
      },
    ];

    expect(query).toEqual(expectedResult);
  });

  it('should be able to add a between filter', () => {
    const betweenFilter = new FilterBetween('someField', [1, 5]);

    const query = builder.withFilter(betweenFilter).build();

    const expectedResult = [
      { $match: {} },
      {
        $match: {
          someField: {
            $gte: 1,
            $lte: 5,
          },
        },
      },
    ];

    expect(query).toEqual(expectedResult);
  });

  it('should be able to add a range filter', () => {
    const lessThanFilter = new FilterLessThan('someField', 10);
    const greaterThanFilter = new FilterGreaterThan('someField', 1);

    const query = builder
      .withFilter(lessThanFilter)
      .withFilter(greaterThanFilter)
      .build();

    const expectedResult = [
      { $match: {} },
      { $match: { someField: { $lt: 10 } } },
      { $match: { someField: { $gt: 1 } } },
    ];

    expect(query).toEqual(expectedResult);
  });

  // TODO[cami]: Check
  it('should build query from search params', () => {
    const builder = new MongoAggsBuilder();

    class CustomSearchFilters extends SearchFilters {
      constructor(private name: FilterLike, private age: FilterMatch<number>) {
        super();
      }
    }

    const nameFilter = new FilterLike('name', 'this is a test');
    const ageFilter = new FilterMatch<number>('age', 23);

    const searchFilters = new CustomSearchFilters(nameFilter, ageFilter);

    const filters = searchFilters.getIterator();

    while (filters?.hasNext()) {
      const filter = filters?.next();
      builder.withFilter(filter);
    }

    const expectedResult = [
      { $match: {} },
      {
        $match: {
          name: {
            $regex: 'this is a test',
            $options: 'i',
          },
        },
      },
      {
        $match: {
          age: 23,
        },
      },
    ];

    const query = builder.build();
    expect(query).toBeDefined();
    expect(query).toEqual(expectedResult);
  });
});
