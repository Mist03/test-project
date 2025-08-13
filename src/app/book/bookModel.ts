import { Injectable } from '@nestjs/common';
import { Genres } from '../genres/genresModel';
import { pool } from '../config/db';
import { Author } from '../author/authorModel';

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
export class BookModel {
  async getAll(): Promise<Book[]> {
    const { rows } = await pool.query(`
      SELECT b.*, 
             a.name as a_name, 
             g.name as g_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN genres g ON b.genre_id = g.id
    `);
    return rows;
  }

  async getById(id: number): Promise<Book | null> {
    const { rows } = await pool.query(
      `
            SELECT b.*, 
                   a.name as a_name, 
                   g.name as g_name
            FROM books b
            JOIN authors a ON b.author_id = a.id
            JOIN genres g ON b.genre_id = g.id
            WHERE b.id = $1`,
      [id],
    );
    return rows[0] || null;
  }

  async create(books: Book): Promise<Book> {
    const { rows } = await pool.query(
      'INSERT INTO books (title, author_id, genre_id, publication_year, isbn) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        books.title,
        books.author_id,
        books.genre_id,
        books.publication_year,
        books.isbn,
      ],
    );
    return rows[0];
  }

  async update(id: number, books: Book): Promise<Book | null> {
    const { rows } = await pool.query(
      'UPDATE books SET title = $1, author_id = $2, genre_id = $3, publication_year = $4, isbn = $5 WHERE id = $6 RETURNING *',
      [
        books.title,
        books.author_id,
        books.genre_id,
        books.publication_year,
        books.isbn,
        id,
      ],
    );
    return rows[0] || null;
  }

  async delete(id: number): Promise<Book | null> {
    const { rows } = await pool.query(
      'DELETE FROM books WHERE id = $1 RETURNING *',
      [id],
    );
    return rows[0] || null;
  }
}
