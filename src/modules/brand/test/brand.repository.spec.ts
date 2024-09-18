import { Test, TestingModule } from '@nestjs/testing';
import { BrandRepository } from '../repository/brand.repository';
import { PrismaService } from '../../../prisma.service';
import {
  MockBrand,
  MockBrandNiche,
  MockCreateBrandDto,
} from './mocks/brand.mock';
import { AppError } from '../../../common/errors/Error';

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

    it('should throw an error if email is already in use', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          await callback(prismaService);
        });

      jest.spyOn(prismaService.brand, 'create').mockRejectedValueOnce({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      try {
        await brandRepository.createBrand(MockCreateBrandDto);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(409);
        expect(error.message).toBe('email already taken');
      }
    });

    it('should throw an error if user is not created', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          await callback(prismaService);
        });

      jest
        .spyOn(prismaService.brand, 'create')
        .mockRejectedValueOnce(
          new AppError(
            'brand-repository.createBrand',
            500,
            'brand not created',
          ),
        );

      try {
        await brandRepository.createBrand(MockCreateBrandDto);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('brand not created');
      }
    });
  });

  describe('find all brands', () => {
    it('should find and list all brands successfully', async () => {
      jest
        .spyOn(prismaService.brand, 'findMany')
        .mockResolvedValueOnce([MockBrand]);

      const result = await brandRepository.findAllBrands();

      expect(prismaService.brand.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockBrand]);
    });

    it('should throw an error if could not get brands', async () => {
      jest
        .spyOn(prismaService.brand, 'findMany')
        .mockRejectedValueOnce(
          new AppError(
            'brand-repository.findAllBrands',
            500,
            'could not get brands',
          ),
        );

      try {
        await brandRepository.findAllBrands();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get brands');
      }
    });
  });
});
