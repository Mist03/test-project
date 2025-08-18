import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/authorModule';
import { GenresModule } from './genres/genresModule';
import { BookModule } from './book/bookModule';
import { UserModule } from './users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthorModule,
    GenresModule,
    BookModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
