import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { InfluencerRepository } from '../repository/influencer.repository';
import { IInfluencerRepository } from '../interfaces/repository.interface';
import { Influencer } from '@prisma/client';
import { IInfluencerDetails } from '../interfaces/influencer.interface';

@Injectable()
export class FindOneInfluencerService {
  constructor(
    @Inject(InfluencerRepository)
    private readonly influencerRepository: IInfluencerRepository<Influencer>,
  ) {}

  private transformInfluencerData(data: any): IInfluencerDetails {
    return {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      reach: data.reach,
      photo: data.photo,
      niches: data.Niche.map((nicheObj) => nicheObj.niche.name),
      address: {
        zipCode: data.InfluencerAddress[0].zipCode,
        state: data.InfluencerAddress[0].state,
        city: data.InfluencerAddress[0].city,
        street: data.InfluencerAddress[0].street,
        number: data.InfluencerAddress[0].number,
      },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async execute(id: string): Promise<IInfluencerDetails> {
    try {
      const influencerData =
        await this.influencerRepository.findOneInfluencer(id);

      return this.transformInfluencerData(influencerData);
    } catch (error) {
      throw new AppError(
        'influencer-service.findOneInfluencer',
        500,
        'failed to get influencer data',
      );
    }
  }
}
