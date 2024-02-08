import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { GeneralDocument } from './GeneralDocument';
import { User } from './User.schema';

@Schema({ timestamps: true })
export class Todo extends GeneralDocument {
  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: User;
}

export type TodoDocument = HydratedDocument<Todo>;
export const TodoSchema = SchemaFactory.createForClass(Todo);
export const TodoFeature = {
  name: Todo.name,
  schema: TodoSchema,
};
