import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  PipeTransform,
} from '@nestjs/common';
import { Jsona } from 'jsona';
import {
  TJsonaDenormalizedIncludeNames,
  TJsonaModel,
  TJsonaNormalizedIncludeNamesTree,
} from 'jsona/lib/JsonaTypes';
import { Observable, map } from 'rxjs';
import { SearchResponse } from '../services';

export type TSerializedData<T> = {
  data: {
    type: string;
    attributes: T;
  };
};

class JsonSerializer extends Jsona {
  override serialize({
    stuff,
    includeNames,
  }: {
    stuff: TJsonaModel | Array<TJsonaModel>;
    includeNames?:
      | TJsonaDenormalizedIncludeNames
      | TJsonaNormalizedIncludeNamesTree;
  }): any {
    if (stuff instanceof SearchResponse) {
      const { data, page, total, ids } = stuff;

      const meta = {
        totalPages: total,
        total,
        ids,
        currentPage: page?.number ?? page?.offset,
        pageSize: page?.size ?? page?.limit,
      };

      const serializedData = super.serialize({ stuff: data, includeNames });
      return {
        ...serializedData,
        meta,
      };
    } else {
      return super.serialize({ stuff, includeNames });
    }
  }
}

export class JsonApiDeserializerPipe<Dto> implements PipeTransform<any, Dto> {
  private readonly jsonaDeserializer;

  constructor() {
    this.jsonaDeserializer = new Jsona();
  }

  transform(value: any) {
    return this.jsonaDeserializer.deserialize(value) as Dto;
  }
}

export const JsonApiSerializeInterceptor = (includeNames = []) => {
  class JsonApiSerializeInterceptorImpl implements NestInterceptor {
    readonly jsonaSerializer = new JsonSerializer();

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          return this.jsonaSerializer.serialize({ stuff: data, includeNames });
        })
      );
    }
  }
  return JsonApiSerializeInterceptorImpl;
};
