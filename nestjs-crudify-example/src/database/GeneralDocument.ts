import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class GeneralDocument {
  _id!: Types.ObjectId;

  @Prop()
  createdAt!: number;

  @Prop()
  updatedAt!: number;
}
