import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException(
        'Доступ запрещен: пользователь не аутентифицирован',
      );
    }
    // Проверяем, есть ли у пользователя роль admin
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Доступ запрещен: недостаточно прав. Требуется роль admin',
      );
    }
    return true;
  }
}
