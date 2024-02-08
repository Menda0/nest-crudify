import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GeneralDocument } from './GeneralDocument';

@Schema({ timestamps: true })
export class User extends GeneralDocument {
  @Prop()
  name?: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
export const UserFeature = {
  name: User.name,
  schema: UserSchema,
};
