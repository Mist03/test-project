import {
  Injectable,
  NotFoundException,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BaseModel } from './baseModel';

@Injectable()
export abstract class BaseController<T> {
  constructor(protected readonly model: BaseModel<T>) {}

  @Get()
  async getAll(): Promise<T[]> {
    return this.model.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<T> {
    const item = await this.model.getById(id);
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  @Post()
  async create(@Body() data: Omit<T, 'id'>): Promise<T> {
    return this.model.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<T>): Promise<T> {
    const item = await this.model.update(id, data);
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const item = await this.model.delete(id);
    if (!item) {
      throw new NotFoundException();
    }
  }
}
