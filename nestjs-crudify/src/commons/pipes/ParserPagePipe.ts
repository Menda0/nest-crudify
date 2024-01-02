import {ArgumentMetadata, PipeTransform} from '@nestjs/common';

export class ParsePage implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return {
      number: parseInt(value.number, 10),
      size: parseInt(value.size, 10),
    };
  }
}
