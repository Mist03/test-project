import { Module } from '@nestjs/common';
import { UserModel } from './userModel';
import { UserController } from './userController';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'fallback_secret',
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserModel],
  exports: [UserModel],
})
export class UserModule {}
