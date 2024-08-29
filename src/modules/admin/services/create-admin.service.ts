import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { AdminRepository } from '../repository/admin.repository';
import { IAdminRepository } from '../interfaces/repository.interface';
import { Admin } from '@prisma/client';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { SecurityService } from '../../../common/services/security.service';
import { IAdmin } from '../interfaces/admin.interface';

@Injectable()
export class CreateAdminService {
  constructor(
    @Inject(AdminRepository)
    private readonly adminRepository: IAdminRepository<Admin>,
    private readonly securityService: SecurityService,
  ) {}

  private transformTimestamps<T extends { created_at: Date; updated_at: Date }>(
    entity: T,
  ): Omit<T, 'created_at' | 'updated_at'> & {
    createdAt: Date;
    updatedAt: Date;
  } {
    const { created_at, updated_at, ...rest } = entity;
    return {
      ...rest,
      createdAt: created_at,
      updatedAt: updated_at,
    };
  }

  async execute(data: CreateAdminDto): Promise<IAdmin> {
    try {
      if (data.password !== data.passwordConfirmation) {
        throw new AppError(
          'admin-service.createAdmin',
          422,
          'passwords do not match',
        );
      }
      delete data.passwordConfirmation;

      const { hashedPassword } = await this.securityService.hashPassword(
        data.password,
      );

      const user = {
        ...data,
        password: hashedPassword,
      };

      const createdUser = await this.adminRepository.createAdmin(user);
      const adminData = this.transformTimestamps(createdUser);

      return adminData;
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
