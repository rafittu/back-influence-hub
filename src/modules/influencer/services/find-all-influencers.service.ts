import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { InfluencerRepository } from '../repository/influencer.repository';
import { IInfluencerRepository } from '../interfaces/repository.interface';
import { Influencer } from '@prisma/client';
import { IInfluencer } from '../interfaces/influencer.interface';

@Injectable()
export class FindAllInfluencersServices {
  constructor(
    @Inject(InfluencerRepository)
    private readonly influencerRepository: IInfluencerRepository<Influencer>,
  ) {}

  private transformTimestamps<T extends { created_at: Date; updated_at: Date }>(
    entity: T,
  ): Omit<T, 'created_at' | 'updated_at'> & {
    createdAt: Date;
    updatedAt: Date;
  } {
    const { created_at, updated_at, ...rest } = entity;
    return {
      ...rest,
      createdAt: created_at,
      updatedAt: updated_at,
    };
  }

  private transformArrayTimestamps<
    T extends { created_at: Date; updated_at: Date },
  >(
    entities: T[],
  ): Array<
    Omit<T, 'created_at' | 'updated_at'> & { createdAt: Date; updatedAt: Date }
  > {
    return entities.map(this.transformTimestamps);
  }

  async execute(): Promise<IInfluencer[]> {
    try {
      const influencers = await this.influencerRepository.findAllInfluencers();
      return this.transformArrayTimestamps(influencers);
    } catch (error) {
      throw new AppError(
        'influencer-service.findAllInfluencer',
        500,
        'failed to get influencers',
      );
    }
  }
}
