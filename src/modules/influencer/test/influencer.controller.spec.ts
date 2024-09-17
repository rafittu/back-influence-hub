import { Test, TestingModule } from '@nestjs/testing';
import { InfluencerController } from '../influencer.controller';
import { CreateInfluencerService } from '../services/create-influencer.service';
import { FindAllInfluencersService } from '../services/find-all-influencers.service';
import { FindOneInfluencerService } from '../services/find-one-influencer.service';
import { UpdateInfluencerService } from '../services/update-influencer.service';
import { InfluencersByFilterService } from '../services/find-influencers-by-filter.service';
import {
  MockCreateInfluencer,
  MockIInfluencer,
  MockInfluencerPhotoFile,
} from './mocks/influencer.mock';

describe('InfluencerController', () => {
  let controller: InfluencerController;
  let createInfluencer: CreateInfluencerService;
  let findAllInfluencers: FindAllInfluencersService;
  let findOneInfluencer: FindOneInfluencerService;
  let updateInfluencer: UpdateInfluencerService;
  let influencersByFilter: InfluencersByFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfluencerController],
      providers: [
        {
          provide: CreateInfluencerService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIInfluencer),
          },
        },
        {
          provide: FindAllInfluencersService,
          useValue: {
            execute: jest.fn().mockResolvedValue([null]),
          },
        },
        {
          provide: FindOneInfluencerService,
          useValue: {
            execute: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: UpdateInfluencerService,
          useValue: {
            execute: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: InfluencersByFilterService,
          useValue: {
            execute: jest.fn().mockResolvedValue([null]),
          },
        },
      ],
    }).compile();

    controller = module.get<InfluencerController>(InfluencerController);
    createInfluencer = module.get<CreateInfluencerService>(
      CreateInfluencerService,
    );
    findAllInfluencers = module.get<FindAllInfluencersService>(
      FindAllInfluencersService,
    );
    findOneInfluencer = module.get<FindOneInfluencerService>(
      FindOneInfluencerService,
    );
    updateInfluencer = module.get<UpdateInfluencerService>(
      UpdateInfluencerService,
    );
    influencersByFilter = module.get<InfluencersByFilterService>(
      InfluencersByFilterService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create influencer', () => {
    it('should create a new influencer successfully', async () => {
      const result = await controller.create(
        MockCreateInfluencer,
        MockInfluencerPhotoFile,
      );

      expect(createInfluencer.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIInfluencer);
    });
  });
});
