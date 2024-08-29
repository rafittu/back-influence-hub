import { faker } from '@faker-js/faker';
import { CreateAdminDto } from '../../dto/create-admin.dto';

export const MockCreateAdmin: CreateAdminDto = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: '@fakePassword',
  passwordConfirmation: '@fakePassword',
};
