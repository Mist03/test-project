import { Controller } from '@nestjs/common';
import { BaseController } from '../baseclass/baseController';
import { Book, BookModel } from './bookModel';

@Controller('books')
export class BookController extends BaseController<Book> {
  constructor(private readonly bookModel: BookModel) {
    super(bookModel);
  }
}
