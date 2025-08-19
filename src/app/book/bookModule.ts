import { Module } from '@nestjs/common';
import { BookController } from './bookController';
import { BookModel } from './bookModel';

@Module({
  controllers: [BookController],
  providers: [BookModel],
  exports: [BookModel],
})
export class BookModule {}
