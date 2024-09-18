import { Test, TestingModule } from '@nestjs/testing';
import { InfluencerRepository } from '../repository/influencer.repository';
import { PrismaService } from '../../../prisma.service';
import {
  MockICreateInfluencer,
  MockInfluencer,
  MockInfluencerNiche,
} from './mocks/influencer.mock';

describe('AdminRepository', () => {
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
  });
});
