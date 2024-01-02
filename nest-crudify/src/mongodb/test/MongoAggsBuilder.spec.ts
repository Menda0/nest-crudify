import {MongoAggsBuilder} from '../services';
import {FilterMatch, FilterMatchIn, FilterLike} from '../services';
import {SearchFilters} from '../../commons';


describe('Testing MongoAggsBuilder', () => {
  let builder: MongoAggsBuilder

  beforeEach(async () => {
    builder = new MongoAggsBuilder()
  });

  it('should be able to add a match filter"', () => {
    const matchFilter = new FilterMatch<string>("filter1","this is a test");
    builder.withFilter(matchFilter)

    const query = builder.build()

    const expectedResult = [
      {"$match":{}},
      {
        "$match": {filter1: "this is a test"}
      }
    ]

    expect(query).toEqual(expectedResult)
  });

  it('should be able to add a match in filter"', () => {
    const matchFilter = new FilterMatchIn<string>("filter1", ["this is a test"]);
    builder.withFilter(matchFilter)

    const query = builder.build()

    const expectedResult = [
      {"$match":{}},
      {
        "$match": {filter1: {$in:["this is a test"]}}
      }
    ]

    expect(query).toEqual(expectedResult)
  });

  it('should be able to add a match like', () => {
    const matchFilter = new FilterLike("filter1","this is a test");
    builder.withFilter(matchFilter)

    const query = builder.build()

    const expectedResult = [
      {"$match":{}},
      {
        "$match": {filter1: { $regex: "this is a test" , $options: 'i' }}
      }
    ]

    expect(query).toEqual(expectedResult)
  })

  it('should build query from search params', () => {
    const builder = new MongoAggsBuilder()

    class CustomSearchFilters extends SearchFilters{
      constructor(private name: FilterLike,private age: FilterMatch<number>) {
        super()
      }
    }

    const nameFilter = new FilterLike("name","this is a test");
    const ageFilter = new FilterMatch("age",23);
    const searchFilters = new CustomSearchFilters(nameFilter, ageFilter)


    const filters = searchFilters.getIterator()

    while(filters?.hasNext()){
      const filter = filters?.next()
      builder.withFilter(filter)
    }

    const expectedResult = [
      {"$match":{}},
      {
        "$match": {
          "name": {
            "$regex": "this is a test",
            "$options": "i"
          }
        }
      },
      {
        "$match": {
          "age": 23
        }
      }
    ]

    const query = builder.build()
    expect(query).toBeDefined()
    expect(query).toEqual(expectedResult)
  })
});
