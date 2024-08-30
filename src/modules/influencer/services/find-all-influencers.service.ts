import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { InfluencerRepository } from '../repository/influencer.repository';
import { IInfluencerRepository } from '../interfaces/repository.interface';
import { Influencer } from '@prisma/client';

@Injectable()
export class FindAllInfluencersServices {
  constructor(
    @Inject(InfluencerRepository)
    private readonly influencerRepository: IInfluencerRepository<Influencer>,
  ) {}

  async execute() {
    try {
      return await this.influencerRepository.findAllInfluencers();
    } catch (error) {
      throw new AppError(
        'influencer-service.findAllInfluencer',
        500,
        'failed to get influencers',
      );
    }
  }
}
