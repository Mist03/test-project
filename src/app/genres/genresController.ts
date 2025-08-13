import { Controller } from '@nestjs/common';
import type { Genres } from './genresModel';
import { GenresModel } from './genresModel';
import { BaseController } from '../baseclass/baseController';

@Controller('genres')
export class GenresController extends BaseController<Genres> {
  constructor(private readonly genresModel: GenresModel) {
    super(genresModel);
  }
}
