import { faker } from '@faker-js/faker';
import { CreateAdminDto } from '../../dto/create-admin.dto';
import { IAdmin } from '../../interfaces/admin.interface';

export const MockCreateAdmin: CreateAdminDto = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: '@fakePassword',
  passwordConfirmation: '@fakePassword',
};

export const MockIAdmin: IAdmin = {
  id: faker.number.int(),
  name: MockCreateAdmin.name,
  email: MockCreateAdmin.email,
  createdAt: new Date(),
  updatedAt: new Date(),
};
