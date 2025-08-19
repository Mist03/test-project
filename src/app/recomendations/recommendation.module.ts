import { Module, forwardRef } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { BookModule } from '../book/bookModule';
import { UserModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => BookModule), forwardRef(() => UserModule)],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
