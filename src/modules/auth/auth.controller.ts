import {
  Controller,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppError } from '../../common/errors/Error';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { LocalAuthGuard } from './infra/guards/local-auth.guard';
import { IAuthRequest } from './interfaces/service.interface';
import { SignInService } from './services/signin.service';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller()
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  async signin(@Request() req: IAuthRequest) {
    const { user } = req;

    return await this.signInService.execute(user);
  }
}
