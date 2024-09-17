import { Test, TestingModule } from '@nestjs/testing';
import { CreateAdminService } from '../services/create-admin.service';
import { SecurityService } from '../../../common/services/security.service';
import { AdminRepository } from '../repository/admin.repository';
import {
  MockAdmin,
  MockCreateAdmin,
  MockIAdmin,
  MockUpdateAdmin,
} from './mocks/admin.mock';
import { AppError } from '../../../common/errors/Error';
import { FindAllAdminsService } from '../services/all-admins.service';
import { FindOneAdminService } from '../services/find-one-admin.service';
import { UpdateAdminService } from '../services/update-admin.service';
import { PrismaService } from '../../../prisma.service';
import { DeleteAdminService } from '../services/delete-admin.service';

describe('AdminServices', () => {
  let createAdmin: CreateAdminService;
  let findAllAdmins: FindAllAdminsService;
  let findOneAdmin: FindOneAdminService;
  let updateAdmin: UpdateAdminService;
  let deleteAdmin: DeleteAdminService;

  let prismaService: PrismaService;
  let securityService: SecurityService;
  let adminRepository: AdminRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAdminService,
        FindAllAdminsService,
        FindOneAdminService,
        UpdateAdminService,
        DeleteAdminService,
        PrismaService,
        SecurityService,
        {
          provide: AdminRepository,
          useValue: {
            createAdmin: jest.fn().mockResolvedValue({
              ...MockAdmin,
              password: undefined,
            }),
            findAllAdmins: jest.fn().mockResolvedValue([MockIAdmin]),
            findOneAdmin: jest.fn().mockResolvedValue(MockIAdmin),
            updateAdmin: jest.fn().mockResolvedValue(MockIAdmin),
            deleteAdmin: jest.fn().mockResolvedValue(MockIAdmin),
          },
        },
      ],
    }).compile();

    createAdmin = module.get<CreateAdminService>(CreateAdminService);
    findAllAdmins = module.get<FindAllAdminsService>(FindAllAdminsService);
    findOneAdmin = module.get<FindOneAdminService>(FindOneAdminService);
    updateAdmin = module.get<UpdateAdminService>(UpdateAdminService);
    deleteAdmin = module.get<DeleteAdminService>(DeleteAdminService);

    prismaService = module.get<PrismaService>(PrismaService);
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
    expect(findOneAdmin).toBeDefined();
    expect(updateAdmin).toBeDefined();
    expect(deleteAdmin).toBeDefined();
  });

  describe('create admin', () => {
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

    it(`should throw an AppError`, async () => {
      jest
        .spyOn(adminRepository, 'findAllAdmins')
        .mockRejectedValueOnce(new AppError());

      try {
        await findAllAdmins.execute();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
      }
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

  describe('find admin by id', () => {
    it('should find and list an admin successfully', async () => {
      const result = await findOneAdmin.execute(String(MockAdmin.id));

      expect(adminRepository.findOneAdmin).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });

    it(`should throw an error if couldn't get admin`, async () => {
      jest
        .spyOn(adminRepository, 'findOneAdmin')
        .mockRejectedValueOnce(new Error());

      try {
        await findOneAdmin.execute(String(MockAdmin.id));
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get admin');
      }
    });
  });

  describe('update admin', () => {
    it('should update admin successfully', async () => {
      jest
        .spyOn(prismaService.admin, 'findFirst')
        .mockResolvedValueOnce(MockAdmin);

      jest
        .spyOn(securityService, 'comparePasswords')
        .mockResolvedValueOnce(true);

      jest
        .spyOn(securityService, 'hashPassword')
        .mockResolvedValueOnce({ hashedPassword: 'hashedPassword' });

      const result = await updateAdmin.execute(
        String(MockIAdmin.id),
        MockUpdateAdmin,
      );

      expect(securityService.comparePasswords).toHaveBeenCalledTimes(1);
      expect(securityService.hashPassword).toHaveBeenCalledTimes(1);
      expect(adminRepository.updateAdmin).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });

    it(`should throw an error if 'oldPassword' doesnt match`, async () => {
      jest
        .spyOn(prismaService.admin, 'findFirst')
        .mockResolvedValueOnce(MockAdmin);

      jest
        .spyOn(securityService, 'comparePasswords')
        .mockResolvedValueOnce(false);

      try {
        await updateAdmin.execute(String(MockIAdmin.id), MockUpdateAdmin);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('invalid old password');
      }
    });

    it(`should throw an error if 'passwordConfirmation' doesnt match`, async () => {
      const invalidPasswordConfirmation = 'invalid_password_confirmation';
      const newBodyRequest = {
        ...MockUpdateAdmin,
        passwordConfirmation: invalidPasswordConfirmation,
      };

      try {
        await updateAdmin.execute(String(MockIAdmin.id), newBodyRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('new passwords do not match');
      }
    });

    it('should throw an error if user not created', async () => {
      jest
        .spyOn(adminRepository, 'updateAdmin')
        .mockRejectedValueOnce(new Error());

      const invalidBody = {
        email: 'example@email.com',
      };

      try {
        await updateAdmin.execute(String(MockIAdmin.id), invalidBody);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get admin');
      }
    });
  });

  describe('delete admin', () => {
    it('should delete an admin successfully', async () => {
      const result = await deleteAdmin.execute(String(MockAdmin.id));

      expect(adminRepository.deleteAdmin).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });

    it(`should throw an error if couldn't delete admin`, async () => {
      jest
        .spyOn(adminRepository, 'deleteAdmin')
        .mockRejectedValueOnce(new Error());

      try {
        await deleteAdmin.execute(String(MockAdmin.id));
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to delete admin');
      }
    });
  });
});
