import {
  Controller,
  Get,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppError } from '../../common/errors/Error';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { LocalAuthGuard } from './infra/guards/local-auth.guard';
import {
  IAuthRequest,
  IUserPayload,
  IUserToken,
} from './interfaces/service.interface';
import { SignInService } from './services/signin.service';
import { isPublic } from './infra/decorators/is-public.decorator';
import { CurrentUser } from './infra/decorators/current-user.decorator';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller()
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @isPublic()
  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  async signin(@Request() req: IAuthRequest): Promise<IUserToken> {
    const { user } = req;

    return await this.signInService.execute(user);
  }

  @Get('/me')
  getMe(@CurrentUser() user: IUserPayload): IUserPayload {
    return user;
  }
}
