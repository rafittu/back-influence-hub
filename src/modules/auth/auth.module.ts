import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './infra/strategies/local.strategy';
import { SignInService } from './services/signin.service';

@Module({
  controllers: [AuthController],
  providers: [LocalStrategy, SignInService],
})
export class AuthModule {}
