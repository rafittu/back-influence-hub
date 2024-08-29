import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { SecurityService } from '../../../common/services/security.service';
import { CredentialsDto } from '../dto/credentials.dto';
import { AppError } from '../../../common/errors/Error';
import {
  IJtwPayload,
  IUserPayload,
  IUserToken,
} from '../interfaces/service.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInService {
  constructor(
    private securityService: SecurityService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(credentials: CredentialsDto): Promise<IUserPayload> {
    const { email, password } = credentials;

    try {
      const user = await this.prisma.admin.findFirst({
        where: { email },
      });

      if (user) {
        const isPasswordValid = await this.securityService.comparePasswords(
          password,
          user.password,
        );

        if (isPasswordValid) {
          return {
            id: user.id,
            name: user.name,
            email,
          };
        }
      }

      throw new AppError(
        'signin-service.validateUser',
        401,
        'email or password is invalid',
      );
    } catch (error) {
      throw error;
    }
  }

  async execute(user: IUserPayload): Promise<IUserToken> {
    try {
      const payload: IJtwPayload = {
        sub: user.id,
        name: user.name,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
