import {
  ArgumentMetadata,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  PipeTransform,
} from '@nestjs/common';
import { Jsona } from 'jsona';
import {map, Observable} from 'rxjs';
import {
  TJsonaDenormalizedIncludeNames,
  TJsonaModel,
  TJsonaNormalizedIncludeNamesTree,
  TJsonApiBody,
} from 'jsona/lib/JsonaTypes';
import {SearcResponse} from '../services';

class JsonSerializer extends Jsona{

  override serialize({stuff, includeNames}: {
    stuff: TJsonaModel | Array<TJsonaModel>;
    includeNames?: TJsonaDenormalizedIncludeNames | TJsonaNormalizedIncludeNamesTree
  }): any {

    if(stuff instanceof SearcResponse){
      const {data, page, total} = stuff
      const meta = {
        "totalPages": total,
        "currentPage": page?.number,
        "pageSize": page?.size
      }
      const serializedData = super.serialize({stuff: data, includeNames});
      return {
        ...serializedData,
        meta
      }
    }else{
      return super.serialize({stuff, includeNames});
    }
  }
}

export class JsonApiDeserializerPipe<Dto> implements PipeTransform<any, Dto> {
  transform(value: any, metadata: ArgumentMetadata) {
    const jsonaDeserializer = new Jsona();
    return jsonaDeserializer.deserialize(value) as Dto;
  }
}

export const JsonApiSerializeInterceptor = (includeNames = []) => {
  class JsonApiSerializeInterceptorImpl implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const jsonaSerializer = new JsonSerializer();
      return next.handle().pipe(map(data => jsonaSerializer.serialize({stuff:data, includeNames})));
    }
  }
  return JsonApiSerializeInterceptorImpl
}
