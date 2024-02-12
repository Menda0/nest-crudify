import { Types } from 'mongoose';

export function parseObjectId(value: string) {
  return new Types.ObjectId(value);
}
