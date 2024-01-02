import {GeneralDocument} from './GeneralDocument';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from 'mongoose';

@Schema({ timestamps: true })
export class Todo extends GeneralDocument{
  @Prop()
  name?: string;

  @Prop()
  description?: string;
}

export type TodoDocument = HydratedDocument<Todo>;
export const TodoSchema = SchemaFactory.createForClass(Todo);
export const TodoFeature = {
  name: Todo.name,
  schema: TodoSchema,
};
