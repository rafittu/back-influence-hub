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
  MockIInfluencerDetails,
  MockInfluencerPhotoFile,
} from './mocks/influencer.mock';
import { DeleteInfluencerService } from '../services/delete-influencer.service';

describe('InfluencerController', () => {
  let controller: InfluencerController;
  let createInfluencer: CreateInfluencerService;
  let findAllInfluencers: FindAllInfluencersService;
  let findOneInfluencer: FindOneInfluencerService;
  let updateInfluencer: UpdateInfluencerService;
  let influencersByFilter: InfluencersByFilterService;
  let deleteInfluencer: DeleteInfluencerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfluencerController],
      providers: [
        {
          provide: CreateInfluencerService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIInfluencerDetails),
          },
        },
        {
          provide: FindAllInfluencersService,
          useValue: {
            execute: jest.fn().mockResolvedValue([MockIInfluencer]),
          },
        },
        {
          provide: FindOneInfluencerService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIInfluencerDetails),
          },
        },
        {
          provide: UpdateInfluencerService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIInfluencerDetails),
          },
        },
        {
          provide: InfluencersByFilterService,
          useValue: {
            execute: jest.fn().mockResolvedValue([MockIInfluencerDetails]),
          },
        },
        {
          provide: DeleteInfluencerService,
          useValue: {
            execute: jest.fn().mockResolvedValue(null),
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
    deleteInfluencer = module.get<DeleteInfluencerService>(
      DeleteInfluencerService,
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
      expect(result).toEqual(MockIInfluencerDetails);
    });
  });

  describe('list all influencers', () => {
    it('should list all influencers successfully', async () => {
      const result = await controller.findAll();

      expect(findAllInfluencers.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockIInfluencer]);
    });
  });

  describe('find one influencer', () => {
    it('should find one influencer successfully', async () => {
      const result = await controller.findOne(String(MockIInfluencer.id));

      expect(findOneInfluencer.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIInfluencerDetails);
    });
  });

  describe('find influencers by filter', () => {
    it('should find influencers by filter successfully', async () => {
      const filter = { city: MockIInfluencerDetails.address.city };
      const result = await controller.findInfluencerByFilter(filter);

      expect(influencersByFilter.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockIInfluencerDetails]);
    });
  });

  describe('update influencer', () => {
    it('should update an influencer successfully', async () => {
      const result = await controller.update(
        String(MockIInfluencer.id),
        null,
        MockInfluencerPhotoFile,
      );

      expect(updateInfluencer.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIInfluencerDetails);
    });
  });

  describe('delete influencer', () => {
    it('should delete influencer successfully', async () => {
      await controller.remove(String(MockIInfluencer.id));

      expect(deleteInfluencer.execute).toHaveBeenCalledTimes(1);
    });
  });
});
