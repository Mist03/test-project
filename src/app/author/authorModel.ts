import { Injectable } from '@nestjs/common';
import { BaseModel } from '../baseclass/baseModel';

export interface Author {
  id?: number;
  name: string;
  birth_date: string;
}

@Injectable()
export class AuthorModel extends BaseModel<Author> {
  protected tableName = 'authors';
}
