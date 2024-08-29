import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { IAdminRepository } from '../interfaces/repository.interface';
import { Admin } from '@prisma/client';
import { ICreateAdmin } from '../interfaces/admin.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class AdminRepository implements IAdminRepository<Admin> {
  constructor(private prisma: PrismaService) {}

  async createAdmin(data: ICreateAdmin) {
    try {
      const user = await this.prisma.admin.create({
        data,
      });

      delete user.password;

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(
          'admin-repository.createAdmin',
          409,
          `${error.meta.target[0]} already in use`,
        );
      }

      throw new AppError(
        'admin-repository.createAdmin',
        500,
        'user not created',
      );
    }
  }
}
