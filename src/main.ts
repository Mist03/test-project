import { NestFactory } from '@nestjs/core';
import { pool } from './app/config/db';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Проверка подключения к БД
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
    } else {
      console.log('Successfully connected to the database');
      console.log('Current database time:', res.rows[0].now);
    }
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
