import { Test, TestingModule } from '@nestjs/testing';
import { CreateBrandService } from '../services/create-brand.service';
import { FindAllBrandsService } from '../services/find-all-brands.service';
import { FindOneBrandService } from '../services/find-one-brand.service';
import { UpdateBrandService } from '../services/update-brand.service';
import { LinkInfluencerService } from '../services/link-influencer.service';
import { FindInfluencersByBrandService } from '../services/influencers-by-brand.service';
import { BrandRepository } from '../repository/brand.repository';
import {
  MockCreateBrandDto,
  MockIBrand,
  MockIBrandDetails,
} from './mocks/brand.mock';
import { AppError } from '../../../common/errors/Error';

describe('AdminServices', () => {
  let createBrand: CreateBrandService;
  let findAllBrands: FindAllBrandsService;
  let findOneBrand: FindOneBrandService;
  let updateBrand: UpdateBrandService;
  let linkBrandInfluencer: LinkInfluencerService;
  let influencersByBrand: FindInfluencersByBrandService;

  let brandRepository: BrandRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBrandService,
        FindAllBrandsService,
        FindOneBrandService,
        UpdateBrandService,
        LinkInfluencerService,
        FindInfluencersByBrandService,
        {
          provide: BrandRepository,
          useValue: {
            createBrand: jest.fn().mockResolvedValue({
              ...MockIBrand,
              created_at: MockIBrand.createdAt,
              updated_at: MockIBrand.updatedAt,
            }),
            findAllBrands: jest.fn().mockResolvedValue([
              {
                ...MockIBrand,
                created_at: MockIBrand.createdAt,
                updated_at: MockIBrand.updatedAt,
              },
            ]),
            findOneBrand: jest.fn().mockResolvedValue({
              ...MockIBrandDetails,
              BrandNiche: MockIBrandDetails.niches.map((niche) => ({
                niche: { name: niche },
              })),
              created_at: MockIBrandDetails.createdAt,
              updated_at: MockIBrandDetails.updatedAt,
            }),
            updateBrand: jest.fn().mockResolvedValue(null),
            associateInfluencer: jest.fn().mockResolvedValue(null),
            findInfluencersByBrand: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    createBrand = module.get<CreateBrandService>(CreateBrandService);
    findAllBrands = module.get<FindAllBrandsService>(FindAllBrandsService);
    findOneBrand = module.get<FindOneBrandService>(FindOneBrandService);
    updateBrand = module.get<UpdateBrandService>(UpdateBrandService);
    linkBrandInfluencer = module.get<LinkInfluencerService>(
      LinkInfluencerService,
    );
    influencersByBrand = module.get<FindInfluencersByBrandService>(
      FindInfluencersByBrandService,
    );

    brandRepository = module.get<BrandRepository>(BrandRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(createBrand).toBeDefined();
    expect(findAllBrands).toBeDefined();
    expect(findOneBrand).toBeDefined();
    expect(updateBrand).toBeDefined();
    expect(linkBrandInfluencer).toBeDefined();
    expect(influencersByBrand).toBeDefined();
  });

  describe('create brand', () => {
    it('should create a new brand successfully', async () => {
      jest.spyOn(createBrand as unknown as never, 'transformTimestamps');

      const result = await createBrand.execute(MockCreateBrandDto);

      expect(brandRepository.createBrand).toHaveBeenCalledTimes(1);
      expect(createBrand['transformTimestamps']).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIBrand);
    });

    it('should throw an error if brand not created', async () => {
      jest
        .spyOn(brandRepository, 'createBrand')
        .mockRejectedValueOnce(new Error());

      try {
        await createBrand.execute(MockCreateBrandDto);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to create brand');
      }
    });

    it('should throw an AppError', async () => {
      jest
        .spyOn(brandRepository, 'createBrand')
        .mockRejectedValueOnce(new AppError());

      try {
        await createBrand.execute(MockCreateBrandDto);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
      }
    });
  });

  describe('find all brands', () => {
    it('should find and list all brands successfully', async () => {
      jest.spyOn(findAllBrands as unknown as never, 'transformTimestamps');
      jest.spyOn(findAllBrands as unknown as never, 'transformArrayTimestamps');

      const result = await findAllBrands.execute();

      expect(brandRepository.findAllBrands).toHaveBeenCalledTimes(1);
      expect(findAllBrands['transformTimestamps']).toHaveBeenCalledTimes(1);
      expect(findAllBrands['transformArrayTimestamps']).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toEqual([MockIBrand]);
    });

    it('should throw an error if could not list brands', async () => {
      jest
        .spyOn(brandRepository, 'findAllBrands')
        .mockRejectedValueOnce(new Error());

      try {
        await findAllBrands.execute();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get brands');
      }
    });
  });

  describe('find brand by id', () => {
    it('should find a brand by id successfully', async () => {
      jest.spyOn(findOneBrand as unknown as never, 'transformInfluencerData');

      const result = await findOneBrand.execute(String(MockIBrand.id));

      expect(brandRepository.findOneBrand).toHaveBeenCalledTimes(1);
      expect(findOneBrand['transformInfluencerData']).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIBrandDetails);
    });
  });
});
