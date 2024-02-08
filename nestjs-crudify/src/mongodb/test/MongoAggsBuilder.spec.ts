import { SearchFilters } from '../../commons';
import {
  FilterLike,
  FilterMatch,
  FilterMatchIn,
  MongoAggsBuilder,
} from '../services';

describe('Testing MongoAggsBuilder', () => {
  let builder: MongoAggsBuilder;

  beforeEach(async () => {
    builder = new MongoAggsBuilder();
  });

  it('should be able to add a match filter"', () => {
    const matchFilter = new FilterMatch<string>('filter1');
    matchFilter.value = 'this is a test';
    builder.withFilter(matchFilter);

    const query = builder.build();

    const expectedResult = [
      { $match: {} },
      {
        $match: { filter1: 'this is a test' },
      },
    ];

    expect(query).toEqual(expectedResult);
  });

  it('should be able to add a match in filter"', () => {
    const matchFilter = new FilterMatchIn<string[]>('filter1');
    matchFilter.value = ['this is a test'];
    builder.withFilter(matchFilter);

    const query = builder.build();

    const expectedResult = [
      { $match: {} },
      {
        $match: { filter1: { $in: ['this is a test'] } },
      },
    ];

    expect(query).toEqual(expectedResult);
  });

  it('should be able to add a match like', () => {
    const matchFilter = new FilterLike('filter1');
    matchFilter.value = 'this is a test';
    builder.withFilter(matchFilter);

    const query = builder.build();

    const expectedResult = [
      { $match: {} },
      {
        $match: { filter1: { $regex: 'this is a test', $options: 'i' } },
      },
    ];

    expect(query).toEqual(expectedResult);
  });

  it('should build query from search params', () => {
    const builder = new MongoAggsBuilder();

    class CustomSearchFilters extends SearchFilters {
      constructor(private name: FilterLike, private age: FilterMatch<number>) {
        super();
      }
    }

    const nameFilter = new FilterLike('name');
    nameFilter.value = 'this is a test';
    const ageFilter = new FilterMatch<number>('age');
    ageFilter.value = 23;
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
