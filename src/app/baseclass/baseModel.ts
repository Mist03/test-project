import { Injectable } from '@nestjs/common';
import { pool } from '../config/db';

@Injectable()
export abstract class BaseModel<T> {
  protected abstract tableName: string;

  async getAll(): Promise<T[]> {
    const { rows } = await pool.query(`SELECT *FROM ${this.tableName}`);
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
    const columns: string = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders: string = values
      .map((_, i: number) => `$${i + 1}`)
      .join(', ');

    const { rows } = await pool.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values,
    );
    return rows[0];
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const entries = Object.entries(data);
    const setClause: string = entries
      .map(([key], i: number) => `${key} = $${i + 1}`)
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

  async addFavorite(
    relationTable: string,
    mainIdField: string,
    relatedIdField: string,
    mainId: number,
    relatedId: number
  ): Promise<void> {
    await pool.query(
      `INSERT INTO ${relationTable} (${mainIdField}, ${relatedIdField})
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [mainId, relatedId],
    );
  }

  async removeFavorite(
    relationTable: string,
    mainIdField: string,
    relatedIdField: string,
    mainId: number,
    relatedId: number
  ): Promise<void> {
    await pool.query(
      `DELETE FROM ${relationTable}
       WHERE ${mainIdField} = $1 AND ${relatedIdField} = $2`,
      [mainId, relatedId],
    );
  }

  async getFavorites<R>(
    relationTable: string,
    mainIdField: string,
    relatedIdField: string,
    relatedTable: string,
    mainId: number
  ): Promise<R[]> {
    const { rows } = await pool.query(
      `SELECT rt.* FROM ${relatedTable} rt
                          JOIN ${relationTable} rel ON rt.id = rel.${relatedIdField}
       WHERE rel.${mainIdField} = $1`,
      [mainId],
    );
    return rows;
  }
}
