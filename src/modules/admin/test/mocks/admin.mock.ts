import { faker } from '@faker-js/faker';
import { CreateAdminDto } from '../../dto/create-admin.dto';
import { IAdmin } from '../../interfaces/admin.interface';
import { Admin } from '@prisma/client';

export const MockCreateAdmin: CreateAdminDto = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: '@fakePassword',
  passwordConfirmation: '@fakePassword',
};

export const MockAdmin: Admin = {
  id: faker.number.int(),
  name: MockCreateAdmin.name,
  email: MockCreateAdmin.email,
  password: faker.internet.password(),
  created_at: new Date(),
  updated_at: new Date(),
};

export const MockIAdmin: IAdmin = {
  id: MockAdmin.id,
  name: MockAdmin.name,
  email: MockAdmin.email,
  createdAt: MockAdmin.created_at,
  updatedAt: MockAdmin.updated_at,
};
