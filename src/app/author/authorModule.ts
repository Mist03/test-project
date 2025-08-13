import { Module } from '@nestjs/common';
import { AuthorController } from './authorController';
import { AuthorModel } from './authorModel';

@Module({
  controllers: [AuthorController],
  providers: [AuthorModel],
})
export class AuthorModule {}
