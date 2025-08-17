import { Injectable } from '@nestjs/common';
import { pool } from '../config/db';
import * as bcrypt from 'bcrypt';
import { BaseModel } from '../baseclass/baseModel';
import { Genres } from '../genres/genresModel';
import { Author } from '../author/authorModel';

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
        throw new Error('No user data returned from database');
      }

      return rows[0];
    } catch (error) {
      console.error('User creation failed:', error);
      throw new Error('Database error during user creation');
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
}
