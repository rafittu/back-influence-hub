import { Test, TestingModule } from '@nestjs/testing';
import { BrandRepository } from '../repository/brand.repository';
import { PrismaService } from '../../../prisma.service';
import {
  MockBrand,
  MockBrandNiche,
  MockCreateBrandDto,
} from './mocks/brand.mock';

describe('BrandRepository', () => {
  let brandRepository: BrandRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandRepository, PrismaService],
    }).compile();

    brandRepository = module.get<BrandRepository>(BrandRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(brandRepository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create brand', () => {
    it('should create a new brand successfully', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          await callback(prismaService);
        });

      jest
        .spyOn(prismaService.brand, 'create')
        .mockResolvedValueOnce(MockBrand);

      jest
        .spyOn(prismaService.brandNiche, 'create')
        .mockResolvedValueOnce(MockBrandNiche);

      await brandRepository.createBrand(MockCreateBrandDto);

      expect(prismaService.brand.create).toHaveBeenCalledTimes(1);
      expect(prismaService.brandNiche.create).toHaveBeenCalledTimes(1);
    });
  });
});
