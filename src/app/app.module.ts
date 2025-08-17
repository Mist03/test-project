import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/authorModule';
import { GenresModule } from './genres/genresModule';
import { BookModule } from './book/bookModule';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    AuthorModule,
    GenresModule,
    BookModule,
    AuthorModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
