import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { AdminRepository } from '../repository/admin.repository';
import { MockAdmin, MockCreateAdmin } from './mocks/admin.mock';

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

  describe('create user', () => {
    it('should create a new user successfully', async () => {
      jest
        .spyOn(prismaService.admin, 'create')
        .mockResolvedValueOnce(MockAdmin);

      const result = await adminRepository.createAdmin(MockCreateAdmin);

      expect(prismaService.admin.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockAdmin);
    });
  });
});
