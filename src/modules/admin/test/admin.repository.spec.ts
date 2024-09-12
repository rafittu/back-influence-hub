import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { AdminRepository } from '../repository/admin.repository';
import {
  MockAdmin,
  MockCreateAdmin,
  MockIAdmin,
  MockIUpdateAdmin,
} from './mocks/admin.mock';
import { AppError } from '../../../common/errors/Error';

describe('AdminRepository', () => {
  let adminRepository: AdminRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminRepository, PrismaService],
    }).compile();

    adminRepository = module.get<AdminRepository>(AdminRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(adminRepository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create admin', () => {
    it('should create a new user successfully', async () => {
      jest
        .spyOn(prismaService.admin, 'create')
        .mockResolvedValueOnce(MockAdmin);

      const result = await adminRepository.createAdmin(MockCreateAdmin);

      expect(prismaService.admin.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockAdmin);
    });

    it('should throw an error if email is already in use', async () => {
      jest.spyOn(prismaService.admin, 'create').mockRejectedValueOnce({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      try {
        await adminRepository.createAdmin(MockCreateAdmin);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(409);
        expect(error.message).toBe('email already in use');
      }
    });

    it('should throw an error if user is not created', async () => {
      jest
        .spyOn(prismaService.admin, 'create')
        .mockRejectedValueOnce(
          new AppError('admin-repository.createAdmin', 500, 'user not created'),
        );

      try {
        await adminRepository.createAdmin(MockCreateAdmin);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('user not created');
      }
    });
  });

  describe('find all admins', () => {
    it('should find and list all admins successfully', async () => {
      jest
        .spyOn(prismaService.admin, 'findMany')
        .mockResolvedValueOnce([MockAdmin]);

      jest.spyOn(adminRepository as unknown as never, 'transformTimestamps');
      jest.spyOn(
        adminRepository as unknown as never,
        'transformArrayTimestamps',
      );

      const result = await adminRepository.findAllAdmins();

      expect(prismaService.admin.findMany).toHaveBeenCalledTimes(1);
      expect(adminRepository['transformTimestamps']).toHaveBeenCalledTimes(1);
      expect(adminRepository['transformArrayTimestamps']).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toEqual([MockIAdmin]);
    });

    it('should throw an error if could not get admins', async () => {
      jest
        .spyOn(prismaService.admin, 'findMany')
        .mockRejectedValueOnce(
          new AppError(
            'admin-repository.findAllIAdmins',
            500,
            'could not get admins',
          ),
        );

      try {
        await adminRepository.findAllAdmins();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get admins');
      }
    });
  });

  describe('find admin by id', () => {
    it('should find and list an admin successfully', async () => {
      jest
        .spyOn(prismaService.admin, 'findFirst')
        .mockResolvedValueOnce(MockAdmin);
      jest.spyOn(adminRepository as unknown as never, 'transformTimestamps');

      const result = await adminRepository.findOneAdmin(String(MockAdmin.id));

      expect(prismaService.admin.findFirst).toHaveBeenCalledTimes(1);
      expect(adminRepository['transformTimestamps']).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });

    it('should throw an error if could not get admin', async () => {
      jest
        .spyOn(prismaService.admin, 'findFirst')
        .mockRejectedValueOnce(
          new AppError(
            'admin-repository.findOneAdmin',
            500,
            'could not get admin',
          ),
        );

      try {
        await adminRepository.findOneAdmin(String(MockAdmin.id));
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get admin');
      }
    });
  });

  describe('update admin data', () => {
    it('should update an admin successfully', async () => {
      jest
        .spyOn(prismaService.admin, 'update')
        .mockResolvedValueOnce(MockAdmin);
      jest.spyOn(adminRepository as unknown as never, 'transformTimestamps');

      const result = await adminRepository.updateAdmin(
        String(MockAdmin.id),
        MockIUpdateAdmin,
      );

      expect(prismaService.admin.update).toHaveBeenCalledTimes(1);
      expect(adminRepository['transformTimestamps']).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });

    it('should throw an error if could not get admin', async () => {
      jest
        .spyOn(prismaService.admin, 'update')
        .mockRejectedValueOnce(
          new AppError(
            'admin-repository.updateAdmin',
            500,
            'could not update admin data',
          ),
        );

      try {
        await adminRepository.updateAdmin(
          String(MockAdmin.id),
          MockIUpdateAdmin,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not update admin data');
      }
    });
  });

  describe('delete admin', () => {
    it('should delete an admin successfully', async () => {
      jest
        .spyOn(prismaService.admin, 'delete')
        .mockResolvedValueOnce(MockAdmin);
      jest.spyOn(adminRepository as unknown as never, 'transformTimestamps');

      const result = await adminRepository.deleteAdmin(String(MockAdmin.id));

      expect(prismaService.admin.delete).toHaveBeenCalledTimes(1);
      expect(adminRepository['transformTimestamps']).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });

    it('should throw an error if could not delete admin', async () => {
      jest
        .spyOn(prismaService.admin, 'delete')
        .mockRejectedValueOnce(
          new AppError(
            'admin-repository.deleteAdmin',
            500,
            'could not delete admin',
          ),
        );

      try {
        await adminRepository.deleteAdmin(String(MockAdmin.id));
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not delete admin');
      }
    });
  });
});
