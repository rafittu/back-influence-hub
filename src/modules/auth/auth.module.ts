import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './infra/strategies/local.strategy';
import { SignInService } from './services/signin.service';
import { PrismaService } from '../../prisma.service';
import { SecurityService } from '../../common/services/security.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],

  controllers: [AuthController],

  providers: [PrismaService, SecurityService, LocalStrategy, SignInService],
})
export class AuthModule {}
