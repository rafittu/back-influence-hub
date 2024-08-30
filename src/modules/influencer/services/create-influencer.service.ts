import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { InfluencerRepository } from '../repository/influencer.repository';
import { IInfluencerRepository } from '../interfaces/repository.interface';
import { Influencer } from '@prisma/client';
import { CreateInfluencerDto } from '../dto/create-influencer.dto';

@Injectable()
export class CreateInfluencerService {
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

  async execute(data: CreateInfluencerDto) {
    try {
      console.log(data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'influencer-service.createInfluencer',
        500,
        'failed to create influencer',
      );
    }
  }
}
