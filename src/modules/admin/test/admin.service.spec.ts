import { Test, TestingModule } from '@nestjs/testing';
import { CreateAdminService } from '../services/create-admin.service';
import { SecurityService } from '../../../common/services/security.service';
import { AdminRepository } from '../repository/admin.repository';
import { MockAdmin, MockCreateAdmin, MockIAdmin } from './mocks/admin.mock';
import { AppError } from '../../../common/errors/Error';
import { FindAllAdminsService } from '../services/all-admins.service';

describe('AdminServices', () => {
  let createAdmin: CreateAdminService;
  let findAllAdmins: FindAllAdminsService;

  let securityService: SecurityService;
  let adminRepository: AdminRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAdminService,
        FindAllAdminsService,
        SecurityService,
        {
          provide: AdminRepository,
          useValue: {
            createAdmin: jest.fn().mockResolvedValue({
              ...MockAdmin,
              password: undefined,
            }),
            findAllAdmins: jest.fn().mockResolvedValue([MockIAdmin]),
          },
        },
      ],
    }).compile();

    createAdmin = module.get<CreateAdminService>(CreateAdminService);
    findAllAdmins = module.get<FindAllAdminsService>(FindAllAdminsService);

    securityService = module.get<SecurityService>(SecurityService);
    adminRepository = module.get<AdminRepository>(AdminRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    MockCreateAdmin.passwordConfirmation = MockCreateAdmin.password;
  });

  it('should be defined', () => {
    expect(createAdmin).toBeDefined();
    expect(findAllAdmins).toBeDefined();
  });

  describe('create user', () => {
    it('should create a new user successfully', async () => {
      jest
        .spyOn(securityService, 'hashPassword')
        .mockResolvedValueOnce({ hashedPassword: 'hashedPassword' });
      jest.spyOn(createAdmin as unknown as never, 'transformTimestamps');

      const result = await createAdmin.execute(MockCreateAdmin);

      expect(securityService.hashPassword).toHaveBeenCalledTimes(1);
      expect(adminRepository.createAdmin).toHaveBeenCalledTimes(1);
      expect(createAdmin['transformTimestamps']).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });

    it(`should throw an error if 'passwordConfirmation' doesnt match`, async () => {
      const invalidPasswordConfirmation = 'invalid_password_confirmation';
      const newBodyRequest = {
        ...MockCreateAdmin,
        passwordConfirmation: invalidPasswordConfirmation,
      };

      try {
        await createAdmin.execute(newBodyRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(422);
        expect(error.message).toBe('passwords do not match');
      }
    });

    it('should throw an error if user not created', async () => {
      jest
        .spyOn(adminRepository, 'createAdmin')
        .mockRejectedValueOnce(new Error());

      try {
        await createAdmin.execute(MockCreateAdmin);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to create admin user');
      }
    });
  });

  describe('find all admins', () => {
    it('should find and list all admins successfully', async () => {
      const result = await findAllAdmins.execute();

      expect(adminRepository.findAllAdmins).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockIAdmin]);
    });

    it(`should throw an error if couldn't get admins`, async () => {
      jest
        .spyOn(adminRepository, 'findAllAdmins')
        .mockRejectedValueOnce(new Error());

      try {
        await findAllAdmins.execute();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get admins');
      }
    });
  });
});
