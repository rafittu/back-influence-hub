import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { AdminRepository } from '../repository/admin.repository';
import { IAdminRepository } from '../interfaces/repository.interface';
import { Admin } from '@prisma/client';
import { CreateAdminDto } from '../dto/create-admin.dto';

@Injectable()
export class CreateAdminService {
  constructor(
    @Inject(AdminRepository)
    private readonly adminRepository: IAdminRepository<Admin>,
  ) {}

  async execute(data: CreateAdminDto) {
    if (data.password !== data.passwordConfirmation) {
      throw new AppError(
        'admin-service.createAdmin',
        422,
        'passwords do not match',
      );
    }
    delete data.passwordConfirmation;

    try {
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'admin-service.createAdmin',
        500,
        'failed to create admin user',
      );
    }
  }
}
