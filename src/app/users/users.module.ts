import { Module } from '@nestjs/common';
import { UserModel } from './userModel';
import { UserController } from './userController';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'fallback_secret',
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserModel, JwtModule, UsersService],
  exports: [UserModel, PassportModule, JwtModule, UsersService],
})
export class UserModule {}
