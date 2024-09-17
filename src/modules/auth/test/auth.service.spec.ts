import { Test, TestingModule } from '@nestjs/testing';
import { SignInService } from '../services/signin.service';
import { JwtService } from '@nestjs/jwt';
import { SecurityService } from '../../../common/services/security.service';
import { PrismaService } from '../../../prisma.service';
import {
  MockUserCredentials,
  MockUserData,
  MockUserPayload,
} from './mocks/auth.mock';
import { AppError } from '../../../common/errors/Error';

describe('AuthService', () => {
  let signInService: SignInService;

  let jwtService: JwtService;
  let securityService: SecurityService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignInService, JwtService, PrismaService, SecurityService],
    }).compile();

    signInService = module.get<SignInService>(SignInService);

    jwtService = module.get<JwtService>(JwtService);
    securityService = module.get<SecurityService>(SecurityService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(signInService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(securityService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('signin', () => {
    it('should validate user credentials successfully', async () => {
      jest
        .spyOn(prismaService.admin, 'findFirst')
        .mockResolvedValueOnce(MockUserData);

      jest
        .spyOn(securityService, 'comparePasswords')
        .mockResolvedValue(true as never);

      const result = await signInService.validateUser(MockUserCredentials);

      expect(prismaService.admin.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockUserPayload);
    });

    it('should throw an error if email or password is invalid', async () => {
      jest.spyOn(prismaService.admin, 'findFirst').mockReturnValueOnce(null);

      try {
        await signInService.validateUser(MockUserCredentials);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(401);
        expect(error.message).toBe('email or password is invalid');
      }
    });
  });
});
