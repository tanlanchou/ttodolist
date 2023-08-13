import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as validator from 'validator';

@Injectable()
export class ValidateEmailPipe implements PipeTransform {
  transform(value: any) {
    if (!validator.default.isEmail(value)) {
      throw new BadRequestException('Invalid email format');
    }
    return value;
  }
}
