import { faker } from '@faker-js/faker';
import {
  IAuthRequest,
  IUserPayload,
  IUserToken,
} from '../../interfaces/service.interface';
import { CredentialsDto } from '../../dto/credentials.dto';
import { Admin } from '@prisma/client';

export const MockUserCredentials: CredentialsDto = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

export const MockUserData: Admin = {
  id: faker.number.int(),
  name: faker.person.fullName(),
  email: MockUserCredentials.email,
  password: MockUserCredentials.password,
  created_at: new Date(),
  updated_at: new Date(),
};

export const MockUserPayload: IUserPayload = {
  id: MockUserData.id,
  name: MockUserData.name,
  email: MockUserData.email,
};

export const MockAuthRequest: IAuthRequest = {
  user: MockUserPayload,
} as IAuthRequest;

export const MockAccessToken: IUserToken = {
  accessToken: faker.string.alphanumeric(),
};
