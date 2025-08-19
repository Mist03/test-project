import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Param,
  Delete,
  Get,
  Request as ReqDecorator,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { User, UserModel } from './userModel';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../auth/jwt-auth.guard';
import { jwtConstants } from '../../auth/constants';

@Controller('users')
export class UserController {
  constructor(
    private readonly userModel: UserModel,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body() data: Omit<User, 'id' | 'role'>,
  ): Promise<{ id: number; username: string; email: string }> {
    try {
      const existingUser = await this.userModel.findByUsername(data.username);
      if (existingUser) {
        throw new UnauthorizedException('Имя пользователя уже существует');
      }

      const user = await this.userModel.create({
        ...data,
        role: 'user',
      });
      if (!user.id) {
        throw new InternalServerErrorException(
          'Пользователь создан, но идентификатор не возвращен',
        );
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Регистрация провалена');
    }
  }

  @Post('login')
  async login(
    @Body() { username, password }: { username: string; password: string },
  ) {
    const user = await this.userModel.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверные учетные данные');
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1h',
        algorithm: 'HS256',
      }),
    };
  }
  @UseGuards(AuthGuard)
  @Post('genres/:genreId')
  async addFavoriteGenre(
    @ReqDecorator() req: { user: { sub: number } },
    @Param('genreId') genreId: number,
  ) {
    if (!req?.user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    console.log(req.user);
    await this.userModel.addFavoriteGenre(req.user.sub, genreId);
    return { message: 'Жанр добавлен в избранное' };
  }

  @Delete('genres/:genreId')
  async removeFavoriteGenre(
    @ReqDecorator() req: { user: { sub: number } },
    @Param('genreId') genreId: number,
  ) {
    await this.userModel.removeFavoriteGenre(req.user.sub, genreId);
    return { message: 'Жанр удален из избранного' };
  }
  @UseGuards(AuthGuard)
  @Get('genres')
  async getFavoriteGenres(@ReqDecorator() req: { user: { sub: number } }) {
    if (!req?.user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.userModel.getFavoriteGenres(req.user.sub);
  }

  @Post('authors/:authorId')
  async addFavoriteAuthor(
    @ReqDecorator() req: { user: { sub: number } },
    @Param('authorId') authorId: number,
  ) {
    await this.userModel.addFavoriteAuthor(req.user.sub, authorId);
    return { message: 'Автор добавлен в избранное' };
  }

  @Delete('authors/:authorId')
  async removeFavoriteAuthor(
    @ReqDecorator() req: { user: { sub: number } },
    @Param('authorId') authorId: number,
  ) {
    await this.userModel.removeFavoriteAuthor(req.user.sub, authorId);
    return { message: 'Автор удален из избранного' };
  }

  @Get('authors')
  async getFavoriteAuthors(@ReqDecorator() req: { user: { sub: number } }) {
    return this.userModel.getFavoriteAuthors(req.user.sub);
  }
}
