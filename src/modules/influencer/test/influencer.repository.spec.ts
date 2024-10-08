import { Test, TestingModule } from '@nestjs/testing';
import { InfluencerRepository } from '../repository/influencer.repository';
import { PrismaService } from '../../../prisma.service';
import {
  MockICreateInfluencer,
  MockIInfluencerDetails,
  MockInfluencer,
  MockInfluencerAddress,
  MockInfluencerFilter,
  MockInfluencerNiche,
  MockUpdateInfluencer,
} from './mocks/influencer.mock';
import { AppError } from '../../../common/errors/Error';

describe('InfluencerRepository', () => {
  let influencerRepository: InfluencerRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfluencerRepository, PrismaService],
    }).compile();

    influencerRepository =
      module.get<InfluencerRepository>(InfluencerRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(influencerRepository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create influencer', () => {
    it('should create a new influencer successfully', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          await callback(prismaService);
        });

      jest
        .spyOn(prismaService.influencer, 'create')
        .mockResolvedValueOnce(MockInfluencer);

      jest
        .spyOn(prismaService.influencerNiche, 'create')
        .mockResolvedValueOnce(MockInfluencerNiche);

      await influencerRepository.createInfluencer(MockICreateInfluencer);

      expect(prismaService.influencer.create).toHaveBeenCalledTimes(1);
      expect(prismaService.influencerNiche.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if email is already in use', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          await callback(prismaService);
        });

      jest.spyOn(prismaService.influencer, 'create').mockRejectedValueOnce({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      try {
        await influencerRepository.createInfluencer(MockICreateInfluencer);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(409);
        expect(error.message).toBe('email already taken');
      }
    });

    it('should throw an error if influencer is not created', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          await callback(prismaService);
        });

      jest
        .spyOn(prismaService.influencer, 'create')
        .mockRejectedValueOnce(
          new AppError(
            'influencer-repository.createInfluencer',
            500,
            'influencer not created',
          ),
        );

      try {
        await influencerRepository.createInfluencer(MockICreateInfluencer);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('influencer not created');
      }
    });
  });

  describe('find all influencers', () => {
    it('should find and list all influencers successfully', async () => {
      jest
        .spyOn(prismaService.influencer, 'findMany')
        .mockResolvedValueOnce([MockInfluencer]);

      const result = await influencerRepository.findAllInfluencers();

      expect(prismaService.influencer.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockInfluencer]);
    });

    it('should throw an error if could not get influencers', async () => {
      jest
        .spyOn(prismaService.influencer, 'findMany')
        .mockRejectedValueOnce(
          new AppError(
            'influencer-repository.findAllInfluencers',
            500,
            'could not get influencers',
          ),
        );

      try {
        await influencerRepository.findAllInfluencers();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get influencers');
      }
    });
  });

  describe('find influencer by id', () => {
    it('should find and list an influencer successfully', async () => {
      jest
        .spyOn(prismaService.influencer, 'findFirst')
        .mockResolvedValueOnce(MockInfluencer);

      const result = await influencerRepository.findOneInfluencer(
        String(MockIInfluencerDetails.id),
      );

      expect(prismaService.influencer.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockInfluencer);
    });

    it('should throw an error if could not get influencer', async () => {
      jest
        .spyOn(prismaService.influencer, 'findFirst')
        .mockRejectedValueOnce(
          new AppError(
            'influencer-repository.findOneInfluencer',
            500,
            'could not get influencer details',
          ),
        );

      try {
        await influencerRepository.findOneInfluencer(
          String(MockIInfluencerDetails.id),
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get influencer details');
      }
    });
  });

  describe('find influencers by filter', () => {
    it('should find and list influencers by filter successfully', async () => {
      jest
        .spyOn(prismaService.influencer, 'findMany')
        .mockResolvedValueOnce([MockInfluencer]);

      const result =
        await influencerRepository.findInfluencerByFilter(MockInfluencerFilter);

      expect(prismaService.influencer.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockInfluencer]);
    });

    it('should find influencers with only reachMin', async () => {
      const filter = {
        ...MockInfluencerFilter,
        reachMax: undefined,
        niche: undefined,
        city: undefined,
      };

      jest
        .spyOn(prismaService.influencer, 'findMany')
        .mockResolvedValueOnce([MockInfluencer]);

      const result = await influencerRepository.findInfluencerByFilter(filter);

      expect(prismaService.influencer.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockInfluencer]);
    });

    it('should find influencers with only reachMax', async () => {
      const filter = {
        ...MockInfluencerFilter,
        reachMin: undefined,
        niche: undefined,
        city: undefined,
      };

      jest
        .spyOn(prismaService.influencer, 'findMany')
        .mockResolvedValueOnce([MockInfluencer]);

      const result = await influencerRepository.findInfluencerByFilter(filter);

      expect(prismaService.influencer.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockInfluencer]);
    });

    it('should throw an error if could not get influencers', async () => {
      jest
        .spyOn(prismaService.influencer, 'findMany')
        .mockRejectedValueOnce(
          new AppError(
            'influencer-repository.findInfluencersByFilter',
            500,
            'could not get influencers',
          ),
        );

      try {
        await influencerRepository.findInfluencerByFilter(MockInfluencerFilter);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get influencers');
      }
    });
  });

  describe('update influencer', () => {
    it('should update an influencer successfully', async () => {
      jest
        .spyOn(prismaService.influencerAddress, 'findFirst')
        .mockResolvedValueOnce(MockInfluencerAddress);

      jest
        .spyOn(prismaService.influencer, 'update')
        .mockResolvedValueOnce(MockInfluencer);

      const result = await influencerRepository.updateInfluencer(
        String(MockIInfluencerDetails.id),
        MockUpdateInfluencer,
      );

      expect(prismaService.influencerAddress.findFirst).toHaveBeenCalledTimes(
        1,
      );
      expect(prismaService.influencer.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockInfluencer);
    });

    it('should throw an error if could not update influencer', async () => {
      jest
        .spyOn(prismaService.influencerAddress, 'findFirst')
        .mockResolvedValueOnce(MockInfluencerAddress);

      jest
        .spyOn(prismaService.influencer, 'update')
        .mockRejectedValueOnce(
          new AppError(
            'influencer-repository.updateInfluencer',
            500,
            'could not update influencer details',
          ),
        );

      try {
        await influencerRepository.updateInfluencer(
          String(MockIInfluencerDetails.id),
          MockUpdateInfluencer,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not update influencer details');
      }
    });
  });

  describe('delete influencer', () => {
    it('should successfully delete influencer', async () => {
      jest
        .spyOn(prismaService.influencer, 'delete')
        .mockResolvedValueOnce(null);

      await influencerRepository.deleteInfluencer(String(MockInfluencer.id));

      expect(prismaService.influencer.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if could not delete influencer', async () => {
      jest
        .spyOn(prismaService.influencer, 'delete')
        .mockRejectedValueOnce(
          new AppError(
            'influencer-repository.deleteInfluencer',
            500,
            'could not delete influencer',
          ),
        );

      try {
        await influencerRepository.deleteInfluencer(String(MockInfluencer.id));
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not delete influencer');
      }
    });
  });
});
