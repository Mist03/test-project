import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import type { Book } from './bookModel';
import { BookModel } from './bookModel';

@Controller('books')
export class BookController {
  constructor(private readonly bookModel: BookModel) {}

  @Get()
  async getAll(): Promise<Book[]> {
    return this.bookModel.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<Book> {
    const book = await this.bookModel.getById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  @Post()
  async create(@Body() bookData: Omit<Book, 'id'>): Promise<Book> {
    return this.bookModel.create(bookData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() bookData: Partial<Book>,
  ): Promise<Book> {
    const updatedBook = await this.bookModel.update(id, <Book>bookData);
    if (!updatedBook) {
      throw new NotFoundException('Book not found');
    }
    return updatedBook;
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const deletedBook = await this.bookModel.delete(id);
    if (!deletedBook) {
      throw new NotFoundException('Book not found');
    }
  }
}
