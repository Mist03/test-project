import { Controller } from '@nestjs/common';
import type { Author } from './authorModel';
import { AuthorModel } from './authorModel';
import { BaseController } from '../baseclass/baseController';

@Controller('authors')
export class AuthorController extends BaseController<Author> {
  constructor(private readonly authorModel: AuthorModel) {
    super(authorModel);
  }
}