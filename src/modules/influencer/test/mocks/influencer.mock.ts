import { faker } from '@faker-js/faker';
import { CreateInfluencerDto } from '../../dto/create-influencer.dto';
import { Niche } from '../../enums/niche.enum';
import {
  IInfluencer,
  IInfluencerDetails,
} from '../../interfaces/influencer.interface';

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
