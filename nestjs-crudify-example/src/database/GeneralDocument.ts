import {Prop} from '@nestjs/mongoose';
import {ObjectId} from "mongoose";

export class GeneralDocument {
  _id!: ObjectId

  @Prop()
  createdAt!: number;

  @Prop()
  updatedAt!: number;
}
