import { faker } from '@faker-js/faker';
import { CreateAdminDto } from '../../dto/create-admin.dto';
import { IAdmin, IUpdateAdmin } from '../../interfaces/admin.interface';
import { Admin } from '@prisma/client';
import { UpdateAdminDto } from '../../dto/update-admin.dto';

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

export const MockUpdateAdmin: UpdateAdminDto = {
  email: faker.internet.email(),
  oldPassword: MockAdmin.password,
  password: '@Newpassword123',
  passwordConfirmation: '@Newpassword123',
};

export const MockIUpdateAdmin: IUpdateAdmin = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: '@Newpassword123',
};
