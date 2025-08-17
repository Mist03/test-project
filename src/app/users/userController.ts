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
} from '@nestjs/common';
import { User, UserModel } from './userModel';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
        throw new UnauthorizedException('Username already exists');
      }

      const user = await this.userModel.create({
        ...data,
        role: 'user',
      });
      if (!user.id) {
        throw new InternalServerErrorException(
          'User created but no ID returned',
        );
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('login')
  async login(
    @Body() { username, password }: { username: string; password: string },
  ) {
    const user = await this.userModel.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  @Post('genres/:genreId')
  async addFavoriteGenre(
    @ReqDecorator() req: { user: { id: number } },
    @Param('genreId') genreId: number,
  ) {
    await this.userModel.addFavoriteGenre(req.user.id, genreId);
    return { message: 'Genre added to favorites' };
  }

  @Delete('genres/:genreId')
  async removeFavoriteGenre(
    @ReqDecorator() req: { user: { id: number } },
    @Param('genreId') genreId: number,
  ) {
    await this.userModel.removeFavoriteGenre(req.user.id, genreId);
    return { message: 'Genre removed from favorites' };
  }

  @Get('genres')
  async getFavoriteGenres(@ReqDecorator() req: { user: { id: number } }) {
    return this.userModel.getFavoriteGenres(req.user.id);
  }

  @Post('authors/:authorId')
  async addFavoriteAuthor(
    @ReqDecorator() req: { user: { id: number } },
    @Param('authorId') authorId: number,
  ) {
    await this.userModel.addFavoriteAuthor(req.user.id, authorId);
    return { message: 'Author added to favorites' };
  }

  @Delete('authors/:authorId')
  async removeFavoriteAuthor(
    @ReqDecorator() req: { user: { id: number } },
    @Param('authorId') authorId: number,
  ) {
    await this.userModel.removeFavoriteAuthor(req.user.id, authorId);
    return { message: 'Author removed from favorites' };
  }

  @Get('authors')
  async getFavoriteAuthors(@ReqDecorator() req: { user: { id: number } }) {
    return this.userModel.getFavoriteAuthors(req.user.id);
  }
}
