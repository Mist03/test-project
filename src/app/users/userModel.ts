import { Injectable } from '@nestjs/common';
import { pool } from '../config/db';
import * as bcrypt from 'bcrypt';
import { BaseModel } from '../baseclass/baseModel';
import { Genres } from '../genres/genresModel';
import { Author } from '../author/authorModel';
import { Book } from '../book/bookModel';

export interface User {
  id?: number;
  username: string;
  password: string;
  email: string;
  role?: 'user' | 'admin';
}
@Injectable()
export class UserModel extends BaseModel<User> {
  protected tableName = 'users';

  async create(data: Omit<User, 'id'>): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const { rows } = await pool.query(
        `INSERT INTO users (username, password, email, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
        [data.username, hashedPassword, data.email, data.role || 'user'],
      );

      if (!rows[0]) {
        throw new Error(
          'Пользовательские данные не были возвращены из базы данных',
        );
      }

      return rows[0];
    } catch (error) {
      console.error('Не удалось создать пользователя:', error);
      throw new Error('Ошибка базы данных при создании пользователя');
    }
  }
  async findByUsername(username: string): Promise<User | null> {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE username = $1`,
      [username],
    );
    return rows[0] || null;
  }
  // Методы для работы с избранными жанрами
  async addFavoriteGenre(userId: number, genreId: number): Promise<void> {
    return this.addFavorite(
      'user_favorite_genres',
      'user_id',
      'genre_id',
      userId,
      genreId,
    );
  }

  async removeFavoriteGenre(userId: number, genreId: number): Promise<void> {
    return this.removeFavorite(
      'user_favorite_genres',
      'user_id',
      'genre_id',
      userId,
      genreId,
    );
  }

  async getFavoriteGenres(userId: number): Promise<Genres[]> {
    return this.getFavorites<Genres>(
      'user_favorite_genres',
      'user_id',
      'genre_id',
      'genres',
      userId,
    );
  }

  // Методы для работы с избранными авторами
  async addFavoriteAuthor(userId: number, authorId: number): Promise<void> {
    return this.addFavorite(
      'user_favorite_authors',
      'user_id',
      'author_id',
      userId,
      authorId,
    );
  }

  async removeFavoriteAuthor(userId: number, authorId: number): Promise<void> {
    return this.removeFavorite(
      'user_favorite_authors',
      'user_id',
      'author_id',
      userId,
      authorId,
    );
  }

  async getFavoriteAuthors(userId: number): Promise<Author[]> {
    return this.getFavorites<Author>(
      'user_favorite_authors',
      'user_id',
      'author_id',
      'authors',
      userId,
    );
  }
  // Методы для работы с книгами
  async addReadBook(userId: number, bookId: number): Promise<void> {
    return this.addFavorite(
      'user_read_books',
      'user_id',
      'book_id',
      userId,
      bookId,
    );
  }

  async removeReadBook(userId: number, bookId: number): Promise<void> {
    return this.removeFavorite(
      'user_read_books',
      'user_id',
      'book_id',
      userId,
      bookId,
    );
  }

  async getReadBooks(userId: number): Promise<Book[]> {
    return this.getFavorites<Book>(
      'user_read_books',
      'user_id',
      'book_id',
      'books',
      userId,
    );
  }

  async addNowReading(userId: number, bookId: number): Promise<void> {
    return this.addFavorite(
      'user_now_reading',
      'user_id',
      'book_id',
      userId,
      bookId,
    );
  }

  async removeNowReading(userId: number, bookId: number): Promise<void> {
    return this.removeFavorite(
      'user_now_reading',
      'user_id',
      'book_id',
      userId,
      bookId,
    );
  }

  async getNowReading(userId: number): Promise<Book[]> {
    return this.getFavorites<Book>(
      'user_now_reading',
      'user_id',
      'book_id',
      'books',
      userId,
    );
  }
}
