import {
  Injectable,
  NotFoundException,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BaseModel } from './baseModel';
import { AuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

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

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async create(@Body() data: Omit<T, 'id'>): Promise<T> {
    return this.model.create(data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<T>): Promise<T> {
    const item = await this.model.update(id, data);
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const item = await this.model.delete(id);
    if (!item) {
      throw new NotFoundException();
    }
  }
}
