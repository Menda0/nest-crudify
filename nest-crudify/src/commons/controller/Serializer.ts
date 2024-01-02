import {
  ArgumentMetadata,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  PipeTransform,
} from '@nestjs/common';
import { Jsona } from 'jsona';
import {map, Observable} from 'rxjs';


export class JsonApiDeserializerPipe<Dto> implements PipeTransform<any, Dto> {
  transform(value: any, metadata: ArgumentMetadata) {
    const jsonaDeserializer = new Jsona();
    return jsonaDeserializer.deserialize(value) as Dto;
  }
}

export const JsonApiSerializeInterceptor = (includeNames = []) => {
  class JsonApiSerializeInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const jsonaSerializer = new Jsona();
      return next.handle().pipe(map(data => jsonaSerializer.serialize({stuff:data, includeNames})));
    }
  }
  return JsonApiSerializeInterceptorImpl
}
