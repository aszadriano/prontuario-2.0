import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    return request.user as User;
  }
);
