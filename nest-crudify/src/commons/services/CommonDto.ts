export interface DtoFactory<Entity, ID, Dto extends CommonDto<ID>> {
  create(entity : Entity): Dto
}

export class CommonDto<T>{
  public id?: T
  constructor(public type?:string, public relationshipNames?: Array<string>){}
}
