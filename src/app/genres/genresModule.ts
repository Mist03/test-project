import { Module } from '@nestjs/common';
import { GenresController } from './genresController';
import { GenresModel } from './genresModel';

@Module({
  controllers: [GenresController],
  providers: [GenresModel],
})
export class GenresModule {}
