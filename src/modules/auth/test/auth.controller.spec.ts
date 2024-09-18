import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { SignInService } from '../services/signin.service';
import {
  MockAccessToken,
  MockAuthRequest,
  MockUserPayload,
} from './mocks/auth.mock';

describe('AuthController', () => {
  let controller: AuthController;

  let signIn: SignInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: SignInService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockAccessToken),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    signIn = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('admin signin', () => {
    it('should return an admin accessToken', async () => {
      const result = await controller.signin(MockAuthRequest);

      expect(signIn.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockAccessToken);
    });
  });

  describe('getMe', () => {
    it('should return the current user from accessToken', () => {
      const result = controller.getMe(MockUserPayload);

      expect(result).toBe(MockUserPayload);
    });
  });
});
