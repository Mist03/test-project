import { Injectable } from '@nestjs/common';
import { BaseModel } from '../baseclass/baseModel';

export interface Genres {
  id?: number;
  name: string;
  description: string;
}

@Injectable()
export class GenresModel extends BaseModel<Genres> {
  protected tableName = 'genres';
}
