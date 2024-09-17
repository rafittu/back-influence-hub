import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppError } from '../../../common/errors/Error';
import { InfluencerRepository } from '../repository/influencer.repository';
import { IInfluencerRepository } from '../interfaces/repository.interface';
import { Influencer } from '@prisma/client';
import { IInfluencerDetails } from '../interfaces/influencer.interface';
import { UpdateInfluencerDto } from '../dto/update-influencer.dto';
import { S3BucketService } from '../../../common/aws/s3Bucket';

@Injectable()
export class UpdateInfluencerService {
  constructor(
    @Inject(InfluencerRepository)
    private readonly influencerRepository: IInfluencerRepository<Influencer>,
    private readonly s3Bucket: S3BucketService,
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
    id: string,
    data: UpdateInfluencerDto,
    file: Express.Multer.File,
  ): Promise<IInfluencerDetails> {
    let influencerData;

    try {
      if (data.zipCode) {
        const zipCodeRegex = /^[0-9]{8}$/;
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

        influencerData = {
          zipCode: formatedZipCode,
          street: logradouro,
          city: localidade,
          state: uf,
        };
      }

      if (data.oldPhoto && file) {
        await this.s3Bucket.deleteImage(data.oldPhoto);
        const s3ImageUrl = await this.s3Bucket.uploadImage(file);

        influencerData = {
          ...influencerData,
          photo: s3ImageUrl,
        };
      }

      influencerData = {
        ...data,
        ...influencerData,
      };

      const updatedInfluencer =
        await this.influencerRepository.updateInfluencer(id, influencerData);

      return this.transformInfluencerData(updatedInfluencer);
    } catch (error) {
      throw new AppError(
        'influencer-service.updateInfluencer',
        500,
        'failed to update influencer data',
      );
    }
  }
}
