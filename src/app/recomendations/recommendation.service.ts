import { Injectable } from '@nestjs/common';
import { BookModel } from '../book/bookModel';
import { UserModel } from '../users/userModel';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly bookModel: BookModel,
    private readonly userModel: UserModel,
  ) {}

  async getRecommendations(userId: number): Promise<any[]> {
    try {
      const [favoriteGenres, favoriteAuthors, readBooks, nowReading] =
        await Promise.all([
          this.userModel.getFavoriteGenres(userId),
          this.userModel.getFavoriteAuthors(userId),
          this.userModel.getReadBooks(userId),
          this.userModel.getNowReading(userId),
        ]);

      const readBookIds = readBooks.map((book) => book.id);
      const nowReadingIds = nowReading.map((book) => book.id);
      const favoriteGenreIds = favoriteGenres.map((genre) => genre.id);
      const favoriteAuthorIds = favoriteAuthors.map((author) => author.id);

      // Получаем все книги
      const allBooks = await this.bookModel.getAll();

      // Рекомендации на основе избранных жанров
      const genreRecommendations = allBooks.filter((book) =>
        favoriteGenreIds.includes(book.genre_id),
      );

      // Рекомендации на основе избранных авторов
      const authorRecommendations = allBooks.filter((book) =>
        favoriteAuthorIds.includes(book.author_id),
      );

      // Рекомендации на основе прочитанных книг
      const similarBooks = this.getSimilarBooks(readBooks, allBooks);

      // Объединяем все рекомендации
      const allRecommendations = [
        ...genreRecommendations,
        ...authorRecommendations,
        ...similarBooks,
      ];

      // Фильтруем: убираем уже прочитанные и читаемые книги
      const filteredRecommendations = allRecommendations.filter(
        (book) =>
          !readBookIds.includes(book.id) &&
          !nowReadingIds.includes(book.id),
      );

      // Убираем дубликаты
      const uniqueRecommendations = this.removeDuplicates(
        filteredRecommendations,
      );

      return uniqueRecommendations.slice(0, 12);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  private getSimilarBooks(readBooks: any[], allBooks: any[]): any[] {
    if (readBooks.length === 0) return [];

    const readGenres = [...new Set(readBooks.map((book) => book.genre_id))];
    const readAuthors = [...new Set(readBooks.map((book) => book.author_id))];

    return allBooks.filter(
      (book) =>
        readGenres.includes(book.genre_id) ||
        readAuthors.includes(book.author_id),
    );
  }

  private removeDuplicates(books: any[]): any[] {
    const seen = new Set();
    return books.filter((book) => {
      const duplicate = seen.has(book.id);
      seen.add(book.id);
      return !duplicate;
    });
  }
}
