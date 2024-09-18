import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from '../brand.controller';
import { CreateBrandService } from '../services/create-brand.service';
import { FindAllBrandsService } from '../services/find-all-brands.service';
import { FindOneBrandService } from '../services/find-one-brand.service';
import { UpdateBrandService } from '../services/update-brand.service';
import { LinkInfluencerService } from '../services/link-influencer.service';
import { FindInfluencersByBrandService } from '../services/influencers-by-brand.service';
import {
  MockCreateBrandDto,
  MockIBrand,
  MockIBrandDetails,
  MockUpdateBrandDto,
} from './mocks/brand.mock';

describe('InfluencerController', () => {
  let controller: BrandController;

  let createBrand: CreateBrandService;
  let findAllBrands: FindAllBrandsService;
  let findOneBrand: FindOneBrandService;
  let updateBrand: UpdateBrandService;
  let linkBrandInfluencer: LinkInfluencerService;
  let influencersByBrand: FindInfluencersByBrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [
        {
          provide: CreateBrandService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIBrand),
          },
        },
        {
          provide: FindAllBrandsService,
          useValue: {
            execute: jest.fn().mockResolvedValue([MockIBrand]),
          },
        },
        {
          provide: FindOneBrandService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIBrandDetails),
          },
        },
        {
          provide: UpdateBrandService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIBrandDetails),
          },
        },
        {
          provide: LinkInfluencerService,
          useValue: {
            execute: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: FindInfluencersByBrandService,
          useValue: {
            execute: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<BrandController>(BrandController);

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create brand', () => {
    it('should create a new brand successfully', async () => {
      const result = await controller.create(MockCreateBrandDto);

      expect(createBrand.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIBrand);
    });
  });

  describe('find and list all brands', () => {
    it('should find and list all brands successfully', async () => {
      const result = await controller.findAll();

      expect(findAllBrands.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockIBrand]);
    });
  });

  describe('find brand by id', () => {
    it('should find a brand by id successfully', async () => {
      const result = await controller.findOne(String(MockIBrand.id));

      expect(findOneBrand.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIBrandDetails);
    });
  });

  describe('update brand', () => {
    it('should update a brand successfully', async () => {
      const result = await controller.update(
        String(MockIBrand.id),
        MockUpdateBrandDto,
      );

      expect(updateBrand.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIBrandDetails);
    });
  });
});
