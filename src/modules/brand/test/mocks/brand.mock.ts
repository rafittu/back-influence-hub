import { faker } from '@faker-js/faker';
import { CreateBrandDto } from '../../dto/create-brand.dto';
import { Niche } from '../../../../modules/influencer/enums/niche.enum';
import {
  IBrand,
  IBrandDetails,
  IBrandInfluencer,
} from '../../interfaces/brand.interface';
import { UpdateBrandDto } from '../../dto/update-brand.dto';

export const MockCreateBrandDto: CreateBrandDto = {
  name: faker.company.name(),
  description: faker.commerce.productDescription(),
  niches: [faker.helpers.arrayElement(Object.values(Niche))],
};

export const MockIBrand: IBrand = {
  id: faker.number.int(),
  name: MockCreateBrandDto.name,
  description: MockCreateBrandDto.description,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const MockIBrandDetails: IBrandDetails = {
  ...MockIBrand,
  niches: MockCreateBrandDto.niches,
};

export const MockUpdateBrandDto: UpdateBrandDto = {
  name: faker.company.name(),
  description: faker.commerce.productDescription(),
  niches: [faker.helpers.arrayElement(Object.values(Niche))],
};

export const MockIBrandInfluencer: IBrandInfluencer = {
  id: faker.number.int(),
  influencerId: faker.number.int(),
  brandId: MockIBrand.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  influencer: {
    id: faker.number.int(),
    name: faker.person.fullName(),
    username: faker.internet.userName(),
    photo: faker.image.avatar(),
    reach: faker.number.int({ min: 1000, max: 1000000 }),
  },
  brand: {
    id: MockIBrand.id,
    name: MockIBrand.name,
    description: MockIBrand.description,
  },
  commonNiches: MockIBrandDetails.niches,
};
