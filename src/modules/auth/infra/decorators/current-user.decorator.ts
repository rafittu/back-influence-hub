import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthRequest, IUserFromJwt } from '../../interfaces/service.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): IUserFromJwt => {
    const request = context.switchToHttp().getRequest<IAuthRequest>();

    return request.user;
  },
);
