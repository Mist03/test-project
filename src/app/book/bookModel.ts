import { Injectable } from '@nestjs/common';
import { Genres } from '../genres/genresModel';
import { Author } from '../author/authorModel';
import { BaseModel } from '../baseclass/baseModel';
import { pool } from '../config/db';

export interface Book {
  id?: number;
  title: string;
  author_id: number;
  genre_id: number;
  publication_year: number;
  isbn: string;
  author?: Author;
  genre?: Genres;
}

@Injectable()
export class BookModel extends BaseModel<Book> {
  protected tableName = 'books';
  async getAll(): Promise<Book[]> {
    const { rows } = await pool.query(`
      SELECT b.*, 
             a.name as author_name, 
             g.name as genre_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN genres g ON b.genre_id = g.id
    `);
    return rows.map(row => ({
      ...row,
      author: { id: row.author_id, name: row.author_name },
      genre: { id: row.genre_id, name: row.genre_name },
    }));
  }

  async getById(id: number): Promise<Book | null> {
    const { rows } = await pool.query(`
      SELECT b.*, 
             a.name as author_name, 
             g.name as genre_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN genres g ON b.genre_id = g.id
      WHERE b.id = $1
    `, [id]);
    if (!rows[0]) return null;
    const row = rows[0];
    return {
      ...row,
      author: { id: row.author_id, name: row.author_name },
      genre: { id: row.genre_id, name: row.genre_name },
    };
  }
}
