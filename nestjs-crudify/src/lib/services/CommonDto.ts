
export interface Factory<Entity, Dto extends CommonDto>{
  create(entity: Entity): Dto;
}

export class CommonDto {
  constructor(public type?: string, public relationshipNames?: Array<string>) {}
}
