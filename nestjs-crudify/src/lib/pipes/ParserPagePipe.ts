import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

type TParsePageValue = { number: string; size: string };

export class ParsePage implements PipeTransform {
  transform(value: TParsePageValue, metadata: ArgumentMetadata) {
    return {
      number: parseInt(value.number, 10),
      size: parseInt(value.size, 10),
    };
  }
}
