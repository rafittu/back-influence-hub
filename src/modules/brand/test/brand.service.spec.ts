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
  MockIBrandInfluencer,
  MockPrismaBrandInfluencer,
  MockUpdateBrandDto,
} from './mocks/brand.mock';
import { AppError } from '../../../common/errors/Error';
import { MockIInfluencer } from '../../../modules/influencer/test/mocks/influencer.mock';
import { UnlinkInfluencerService } from '../services/unlink-influencer.service';

describe('BrandServices', () => {
  let createBrand: CreateBrandService;
  let findAllBrands: FindAllBrandsService;
  let findOneBrand: FindOneBrandService;
  let updateBrand: UpdateBrandService;
  let linkBrandInfluencer: LinkInfluencerService;
  let influencersByBrand: FindInfluencersByBrandService;
  let unlinkBrandInfluencer: UnlinkInfluencerService;

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
        UnlinkInfluencerService,
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
            updateBrand: jest.fn().mockResolvedValue({
              ...MockIBrandDetails,
              BrandNiche: MockIBrandDetails.niches.map((niche) => ({
                niche: { name: niche },
              })),
              created_at: MockIBrandDetails.createdAt,
              updated_at: MockIBrandDetails.updatedAt,
            }),
            associateInfluencer: jest
              .fn()
              .mockResolvedValue(MockPrismaBrandInfluencer),
            findInfluencersByBrand: jest
              .fn()
              .mockResolvedValue([MockPrismaBrandInfluencer]),
            diassociateInfluencer: jest.fn(),
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
    unlinkBrandInfluencer = module.get<UnlinkInfluencerService>(
      UnlinkInfluencerService,
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
    expect(unlinkBrandInfluencer).toBeDefined();
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

    it('should throw an error if could not find brand', async () => {
      jest
        .spyOn(brandRepository, 'findOneBrand')
        .mockRejectedValueOnce(new Error());

      try {
        await findOneBrand.execute(String(MockIBrand.id));
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get brand');
      }
    });
  });

  describe('update brand', () => {
    it('should update a brand successfully', async () => {
      jest.spyOn(updateBrand as unknown as never, 'transformInfluencerData');

      const result = await updateBrand.execute(
        String(MockIBrand.id),
        MockUpdateBrandDto,
      );

      expect(brandRepository.updateBrand).toHaveBeenCalledTimes(1);
      expect(updateBrand['transformInfluencerData']).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIBrandDetails);
    });

    it('should throw an error if could not update brand', async () => {
      jest
        .spyOn(brandRepository, 'updateBrand')
        .mockRejectedValueOnce(new Error());

      try {
        await updateBrand.execute(String(MockIBrand.id), MockUpdateBrandDto);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to update brand data');
      }
    });
  });

  describe('associate brand with influencer', () => {
    it('should associate a influencer with a brand successfully', async () => {
      jest.spyOn(
        linkBrandInfluencer as unknown as never,
        'formatAssociationResult',
      );

      const result = await linkBrandInfluencer.execute(
        String(MockIBrand.id),
        String(MockIInfluencer.id),
      );

      expect(brandRepository.associateInfluencer).toHaveBeenCalledTimes(1);
      expect(
        linkBrandInfluencer['formatAssociationResult'],
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIBrandInfluencer);
    });

    it('should throw an error if could not associate influencer with brand', async () => {
      jest
        .spyOn(brandRepository, 'associateInfluencer')
        .mockRejectedValueOnce(new Error());

      try {
        await linkBrandInfluencer.execute(
          String(MockIBrand.id),
          String(MockIInfluencer.id),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to link influencer with brand');
      }
    });
  });

  describe('find all influencers associated with a brand', () => {
    it('should find all influencers associated with a brand successfully', async () => {
      jest.spyOn(
        influencersByBrand as unknown as never,
        'transformBrandInfluencerData',
      );

      const result = await influencersByBrand.execute(MockIBrand.name);

      expect(brandRepository.findInfluencersByBrand).toHaveBeenCalledTimes(1);
      expect(
        influencersByBrand['transformBrandInfluencerData'],
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockIBrandInfluencer]);
    });

    it('should throw an error if could not find influencers by brand', async () => {
      jest
        .spyOn(brandRepository, 'findInfluencersByBrand')
        .mockRejectedValueOnce(new Error());

      try {
        await influencersByBrand.execute(MockIBrand.name);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get influencers');
      }
    });
  });

  describe('disassociate brand from influencer', () => {
    it('should disassociate an influencer from brand successfully', async () => {
      await unlinkBrandInfluencer.execute(
        String(MockIBrand.id),
        String(MockIInfluencer.id),
      );

      expect(brandRepository.disassociateInfluencer).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if could not unlink influencer from brand', async () => {
      jest
        .spyOn(brandRepository, 'disassociateInfluencer')
        .mockRejectedValueOnce(new Error());

      try {
        await unlinkBrandInfluencer.execute(
          String(MockIBrand.id),
          String(MockIInfluencer.id),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to unlink influencer from brand');
      }
    });
  });
});
