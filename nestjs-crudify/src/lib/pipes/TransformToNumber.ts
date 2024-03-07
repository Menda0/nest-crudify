import { Transform } from 'class-transformer';

export const TransformToNumber = (defaultValue = 10) => {
  return Transform(({ value }) => parseInt(value, defaultValue));
};
