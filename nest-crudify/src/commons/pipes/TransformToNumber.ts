import {Transform} from 'class-transformer';

export const TransformToNumber = () => {
  return Transform(({ value }) => parseInt(value, 10))
}
