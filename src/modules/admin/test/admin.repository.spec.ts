import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { AdminRepository } from '../repository/admin.repository';

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
});
