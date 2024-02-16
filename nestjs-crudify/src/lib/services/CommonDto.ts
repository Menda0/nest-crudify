export interface Factory<Entity, ID, Dto extends CommonDto<ID>> {
  createDto(entity: Entity): Dto;
  createEntity(dto: Dto): Entity;
}

export class CommonDto<T> {
  public id?: T;
  constructor(public type?: string, public relationshipNames?: Array<string>) {}
}
