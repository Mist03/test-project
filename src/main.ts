import { NestFactory } from '@nestjs/core';
import { pool } from './app/config/db';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Включение CORS с разрешением Authorization
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
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
