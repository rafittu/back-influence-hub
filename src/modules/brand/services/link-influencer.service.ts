import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { IBrandRepository } from '../interfaces/repository.interface';
import { Brand } from '@prisma/client';
import { BrandRepository } from '../repository/brand.repository';

@Injectable()
export class LinkInfluencerService {
  constructor(
    @Inject(BrandRepository)
    private readonly brandRepository: IBrandRepository<Brand>,
  ) {}

  async execute(brandId: string, influencerId: string) {
    try {
      return await this.brandRepository.associateInfluencer(
        brandId,
        influencerId,
      );
    } catch (error) {
      throw new AppError(
        'brand-service.linkInfluencer',
        500,
        'failed to link influencer with brand',
      );
    }
  }
}
