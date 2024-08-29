import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { AdminRepository } from '../repository/admin.repository';
import { IAdminRepository } from '../interfaces/repository.interface';
import { Admin } from '@prisma/client';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { SecurityService } from '../../../common/services/security.service';

@Injectable()
export class CreateAdminService {
  constructor(
    @Inject(AdminRepository)
    private readonly adminRepository: IAdminRepository<Admin>,
    private readonly securityService: SecurityService,
  ) {}

  async execute(data: CreateAdminDto) {
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

      return await this.adminRepository.createAdmin(user);
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
