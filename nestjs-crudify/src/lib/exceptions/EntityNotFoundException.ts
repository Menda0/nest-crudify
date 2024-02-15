import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(modelName: string, id: string) {
    super(
      `Entity of type ${modelName} not found with id:${id}`,
      HttpStatus.NOT_FOUND
    );
  }
}
