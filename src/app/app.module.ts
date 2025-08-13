import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/authorModule';
import { GenresModule } from './genres/genresModule';
import { BookModule } from './book/bookModule';

@Module({
  imports: [AuthorModule, GenresModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
