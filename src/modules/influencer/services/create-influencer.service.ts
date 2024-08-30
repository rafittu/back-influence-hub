import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppError } from '../../../common/errors/Error';
// import { InfluencerRepository } from '../repository/influencer.repository';
// import { IInfluencerRepository } from '../interfaces/repository.interface';
// import { Influencer } from '@prisma/client';
import { CreateInfluencerDto } from '../dto/create-influencer.dto';

@Injectable()
export class CreateInfluencerService {
  constructor() {} // private readonly influencerRepository: IInfluencerRepository<Influencer>, // @Inject(InfluencerRepository)

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

  private async getAddress(zipCode: string) {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${zipCode}/json/`,
      );

      if (response.data.erro) {
        throw new Error();
      }

      return response.data;
    } catch (error) {
      throw new AppError(
        'create-influencer.getAddress',
        400,
        'error fetching address from ViaCEP',
      );
    }
  }

  async execute(data: CreateInfluencerDto) {
    const zipCodeRegex = /^[0-9]{8}$/;

    try {
      const formatedZipCode = data.zipCode.replace('-', '');

      const isZipCodeValid = zipCodeRegex.test(formatedZipCode);
      if (!isZipCodeValid) {
        throw new AppError(
          'influencer-service.createInfluencer',
          400,
          'invalid zipcode format',
        );
      }

      const address = await this.getAddress(formatedZipCode);
      const { logradouro, localidade, uf } = address;

      const influencerData = {
        ...data,
        zipCode: formatedZipCode,
        street: logradouro,
        city: localidade,
        state: uf,
      };

      console.log(influencerData);

      return data;
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
