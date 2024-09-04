import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { IBrandRepository } from '../interfaces/repository.interface';
import { Brand } from '@prisma/client';
import { BrandRepository } from '../repository/brand.repository';
import { IBrandInfluencer } from '../interfaces/brand.interface';

@Injectable()
export class LinkInfluencerService {
  constructor(
    @Inject(BrandRepository)
    private readonly brandRepository: IBrandRepository<Brand>,
  ) {}

  private formatAssociationResult(influencerBrand: any) {
    const influencerNicheNames = influencerBrand.influencer.Niche.map(
      (nicheObj: any) => nicheObj.niche.name,
    );
    const brandNicheNames = influencerBrand.brand.BrandNiche.map(
      (nicheObj: any) => nicheObj.niche.name,
    );

    const commonNiches = influencerNicheNames.filter((niche: string) =>
      brandNicheNames.includes(niche),
    );

    return {
      id: influencerBrand.id,
      influencerId: influencerBrand.influencer_id,
      brandId: influencerBrand.brand_id,
      createdAt: influencerBrand.created_at,
      updatedAt: influencerBrand.updated_at,
      influencer: {
        id: influencerBrand.influencer.id,
        name: influencerBrand.influencer.name,
        username: influencerBrand.influencer.username,
        photo: influencerBrand.influencer.photo,
        reach: influencerBrand.influencer.reach,
      },
      brand: {
        id: influencerBrand.brand.id,
        name: influencerBrand.brand.name,
        description: influencerBrand.brand.description,
      },
      commonNiches,
    };
  }

  async execute(
    brandId: string,
    influencerId: string,
  ): Promise<IBrandInfluencer> {
    try {
      const influencerBrand = await this.brandRepository.associateInfluencer(
        brandId,
        influencerId,
      );

      return this.formatAssociationResult(influencerBrand);
    } catch (error) {
      throw new AppError(
        'brand-service.linkInfluencer',
        500,
        'failed to link influencer with brand',
      );
    }
  }
}
