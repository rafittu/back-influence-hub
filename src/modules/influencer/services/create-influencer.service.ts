import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppError } from '../../../common/errors/Error';
import { InfluencerRepository } from '../repository/influencer.repository';
import { IInfluencerRepository } from '../interfaces/repository.interface';
import { Influencer } from '@prisma/client';
import { CreateInfluencerDto } from '../dto/create-influencer.dto';
import { IInfluencerDetails } from '../interfaces/influencer.interface';
import { S3BucketService } from 'src/common/aws/s3Bucket';

@Injectable()
export class CreateInfluencerService {
  constructor(
    @Inject(InfluencerRepository)
    private readonly influencerRepository: IInfluencerRepository<Influencer>,
    private readonly s3Bucket: S3BucketService,
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

  async execute(
    data: CreateInfluencerDto,
    file: Express.Multer.File,
  ): Promise<IInfluencerDetails> {
    let s3ImageUrl: string | undefined;

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

      const { logradouro, localidade, uf } =
        await this.getAddress(formatedZipCode);

      s3ImageUrl = await this.s3Bucket.uploadImage(file);

      const influencer = {
        ...data,
        photo: s3ImageUrl,
        zipCode: formatedZipCode,
        street: logradouro,
        city: localidade,
        state: uf,
      };

      const createdInfluencer =
        await this.influencerRepository.createInfluencer(influencer);
      const influencerData = this.transformTimestamps(createdInfluencer);

      return {
        ...influencerData,
        niches: data.niches,
        address: {
          zipCode: formatedZipCode,
          street: logradouro,
          city: localidade,
          state: uf,
          number: data.number,
        },
      };
    } catch (error) {
      if (s3ImageUrl) {
        await this.s3Bucket.deleteImage(s3ImageUrl);
      }

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
