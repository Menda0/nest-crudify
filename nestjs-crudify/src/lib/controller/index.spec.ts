import { JsonApiDeserializerPipe } from './Serializer';

describe('JsonApiDeserializerPipe', () => {
  let deserializePipe: JsonApiDeserializerPipe<unknown>;

  beforeEach(() => {
    deserializePipe = new JsonApiDeserializerPipe<unknown>();
  });

  it('should deserialize the input data correctly', () => {
    const input = {
      data: {
        type: 'type1',
        id: '1',
        attributes: {
          exampleAttribute: 'value',
        },
        relationships: {
          customer: {
            data: { type: 'type2', id: '2', customerAttribute: 'value2' },
          },
        },
      },
      included: [
        {
          type: 'type2',
          id: '2',
          attributes: {
            customerAttribute: 'value2',
          },
        },
      ],
    };

    const expected = {
      type: 'type1',
      id: '1',
      exampleAttribute: 'value',
      customer: { type: 'type2', id: '2', customerAttribute: 'value2' },
      relationshipNames: ['customer'],
    };

    const pipeResult = deserializePipe.transform(input);

    expect(pipeResult).toEqual(expected);
  });
});
