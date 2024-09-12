import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { AdminRepository } from '../repository/admin.repository';
import { IAdminRepository } from '../interfaces/repository.interface';
import { Admin } from '@prisma/client';
import { IAdmin } from '../interfaces/admin.interface';

@Injectable()
export class DeleteAdminService {
  constructor(
    @Inject(AdminRepository)
    private readonly adminRepository: IAdminRepository<Admin>,
  ) {}

  async execute(id: string): Promise<IAdmin> {
    try {
      return await this.adminRepository.deleteAdmin(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'admin-service.deleteAdmin',
        500,
        'failed to delete admin',
      );
    }
  }
}
