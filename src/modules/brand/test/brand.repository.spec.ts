import { Test, TestingModule } from '@nestjs/testing';
import { BrandRepository } from '../repository/brand.repository';
import { PrismaService } from '../../../prisma.service';
import {
  MockBrand,
  MockBrandNiche,
  MockCreateBrandDto,
  MockIBrand,
  MockIBrandInfluencer,
  MockPrismaBrandInfluencer,
  MockUpdateBrandDto,
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

  describe('find brand by id', () => {
    it('should find and list a brand successfully', async () => {
      jest
        .spyOn(prismaService.brand, 'findFirst')
        .mockResolvedValueOnce(MockBrand);

      const result = await brandRepository.findOneBrand(String(MockIBrand.id));

      expect(prismaService.brand.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockBrand);
    });

    it('should throw an error if could not get brand', async () => {
      jest
        .spyOn(prismaService.brand, 'findFirst')
        .mockRejectedValueOnce(
          new AppError(
            'brand-repository.findOneBrand',
            500,
            'could not get brand details',
          ),
        );

      try {
        await brandRepository.findOneBrand(String(MockIBrand.id));
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get brand details');
      }
    });
  });

  describe('update brand', () => {
    it('should update brand successfully', async () => {
      jest
        .spyOn(prismaService.brand, 'update')
        .mockResolvedValueOnce(MockBrand);

      const result = await brandRepository.updateBrand(
        String(MockIBrand.id),
        MockUpdateBrandDto,
      );

      expect(prismaService.brand.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockBrand);
    });

    it('should throw an error if could not update brand details', async () => {
      jest
        .spyOn(prismaService.brand, 'update')
        .mockRejectedValueOnce(
          new AppError(
            'brand-repository.updateBrand',
            500,
            'could not update brand details',
          ),
        );

      try {
        await brandRepository.updateBrand(
          String(MockIBrand.id),
          MockUpdateBrandDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not update brand details');
      }
    });
  });

  describe('associate influencer', () => {
    it('should successfully associate a brand with an influencer', async () => {
      jest
        .spyOn(prismaService.influencerBrand, 'create')
        .mockResolvedValueOnce(MockPrismaBrandInfluencer);

      const result = await brandRepository.associateInfluencer(
        String(MockIBrand.id),
        String(MockIBrandInfluencer.influencerId),
      );

      expect(prismaService.influencerBrand.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockPrismaBrandInfluencer);
    });

    it('should throw an error if could not link brand with influencer', async () => {
      jest
        .spyOn(prismaService.influencerBrand, 'create')
        .mockRejectedValueOnce(
          new AppError(
            'brand-repository.associateInfluencer',
            500,
            'could not link brand with influencer',
          ),
        );

      try {
        await brandRepository.associateInfluencer(
          String(MockIBrand.id),
          String(MockIBrandInfluencer.influencerId),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not link brand with influencer');
      }
    });
  });

  describe('find influencers by brand', () => {
    it('should successfully find influencers for a given brand', async () => {
      jest
        .spyOn(prismaService.influencerBrand, 'findMany')
        .mockResolvedValueOnce([MockPrismaBrandInfluencer]);

      const result = await brandRepository.findInfluencersByBrand(
        MockIBrand.name,
      );

      expect(prismaService.influencerBrand.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockPrismaBrandInfluencer]);
    });

    it('should throw an error if could not get influencers by brand', async () => {
      jest
        .spyOn(prismaService.influencerBrand, 'findMany')
        .mockRejectedValueOnce(
          new AppError(
            'brand-repository.findInfluencersByBrand',
            500,
            'could not get influencers',
          ),
        );

      try {
        await brandRepository.findInfluencersByBrand(MockIBrand.name);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get influencers');
      }
    });
  });
});
