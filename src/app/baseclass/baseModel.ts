import { Injectable } from '@nestjs/common';
import { pool } from '../config/db';

@Injectable()
export abstract class BaseModel<T> {
  protected abstract tableName: string;

  async getAll(): Promise<T[]> {
    const { rows } = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  async getById(id: number): Promise<T | null> {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const { rows } = await pool.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values,
    );
    return rows[0];
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const entries = Object.entries(data);
    const setClause = entries
      .map(([key], i) => `${key} = $${i + 1}`)
      .join(', ');
    const values = entries.map(([, value]) => value);

    const { rows } = await pool.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id],
    );
    return rows[0] || null;
  }

  async delete(id: number): Promise<T | null> {
    const { rows } = await pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  }
}
