import { faker } from '@faker-js/faker';
import { CreateInfluencerDto } from '../../dto/create-influencer.dto';
import { Niche } from '../../enums/niche.enum';
import {
  ICreateInfluencer,
  IInfluencer,
  IInfluencerDetails,
  IInfluencerFilters,
} from '../../interfaces/influencer.interface';
import { Influencer, InfluencerNiche } from '@prisma/client';

export const MockCreateInfluencer: CreateInfluencerDto = {
  name: faker.person.fullName(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  reach: faker.number.int({ min: 1000, max: 1000000 }),
  niches: [faker.helpers.arrayElement(Object.values(Niche))],
  zipCode: '99999999',
  street: faker.location.street(),
  number: faker.location.buildingNumber(),
};

export const MockInfluencerPhotoFile = {
  fieldname: 'photo',
  originalname: 'test.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('test content'),
  size: 1024,
} as Express.Multer.File;

export const MockIInfluencerDetails: IInfluencerDetails = {
  id: faker.number.int(),
  name: MockCreateInfluencer.name,
  username: MockCreateInfluencer.username,
  email: MockCreateInfluencer.email,
  reach: MockCreateInfluencer.reach,
  photo: faker.image.avatar(),
  niches: MockCreateInfluencer.niches,
  address: {
    zipCode: MockCreateInfluencer.zipCode,
    state: faker.location.state(),
    city: faker.location.city(),
    street: MockCreateInfluencer.street,
    number: MockCreateInfluencer.number,
  },
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};

export const MockIInfluencer: IInfluencer = {
  id: MockIInfluencerDetails.id,
  name: MockIInfluencerDetails.name,
  username: MockIInfluencerDetails.username,
  email: MockIInfluencerDetails.email,
  reach: MockIInfluencerDetails.reach,
  photo: MockIInfluencerDetails.photo,
  createdAt: MockIInfluencerDetails.createdAt,
  updatedAt: MockIInfluencerDetails.updatedAt,
};

export const MockInfluencerFilter: IInfluencerFilters = {
  reachMin: String(MockIInfluencerDetails.reach - 7),
  reachMax: String(MockIInfluencerDetails.reach + 7),
  niche: MockIInfluencerDetails.niches,
  city: MockIInfluencerDetails.address.city,
};

export const MockICreateInfluencer: ICreateInfluencer = {
  name: MockIInfluencerDetails.name,
  username: MockIInfluencerDetails.username,
  email: MockIInfluencerDetails.email,
  reach: MockIInfluencerDetails.reach,
  photo: MockIInfluencerDetails.photo,
  niches: MockCreateInfluencer.niches,
  zipCode: MockCreateInfluencer.zipCode,
  state: MockIInfluencerDetails.address.state,
  city: MockIInfluencerDetails.address.city,
  street: MockCreateInfluencer.street,
  number: MockCreateInfluencer.number,
};

export const MockInfluencer: Influencer = {
  id: MockIInfluencerDetails.id,
  name: MockIInfluencerDetails.name,
  username: MockIInfluencerDetails.username,
  email: MockIInfluencerDetails.email,
  reach: MockIInfluencerDetails.reach,
  photo: MockIInfluencerDetails.photo,
  created_at: MockIInfluencerDetails.createdAt,
  updated_at: MockIInfluencerDetails.updatedAt,
};

export const MockInfluencerNiche: InfluencerNiche = {
  influencerId: MockIInfluencerDetails.id,
  nicheId: faker.number.int(),
  created_at: new Date(),
  updated_at: new Date(),
};

export const MockPrismaInfluencer = {
  ...MockIInfluencerDetails,
  Niche: MockIInfluencerDetails.niches.map((niche) => ({
    niche: { name: niche },
  })),
  InfluencerAddress: [
    {
      zipCode: MockIInfluencerDetails.address.zipCode,
      state: MockIInfluencerDetails.address.state,
      city: MockIInfluencerDetails.address.city,
      street: MockIInfluencerDetails.address.street,
      number: MockIInfluencerDetails.address.number,
    },
  ],
  created_at: MockIInfluencerDetails.createdAt,
  updated_at: MockIInfluencerDetails.updatedAt,
};
