import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { IAdminRepository } from '../interfaces/repository.interface';
import { Admin } from '@prisma/client';
import {
  IAdmin,
  ICreateAdmin,
  IUpdateAdmin,
} from '../interfaces/admin.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class AdminRepository implements IAdminRepository<Admin> {
  constructor(private prisma: PrismaService) {}

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

  private transformArrayTimestamps<
    T extends { created_at: Date; updated_at: Date },
  >(
    entities: T[],
  ): Array<
    Omit<T, 'created_at' | 'updated_at'> & { createdAt: Date; updatedAt: Date }
  > {
    return entities.map(this.transformTimestamps);
  }

  async createAdmin(data: ICreateAdmin): Promise<Admin> {
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

  async findAllAdmins(): Promise<IAdmin[]> {
    try {
      const admins = await this.prisma.admin.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      });

      return this.transformArrayTimestamps(admins);
    } catch (error) {
      throw new AppError(
        'admin-repository.findAllIAdmins',
        500,
        'could not get admins',
      );
    }
  }

  async findOneAdmin(id: string): Promise<IAdmin> {
    try {
      const admin = await this.prisma.admin.findFirst({
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      });

      return this.transformTimestamps(admin);
    } catch (error) {
      throw new AppError(
        'admin-repository.findOneAdmin',
        500,
        'could not get admin',
      );
    }
  }

  async updateAdmin(id: string, data: IUpdateAdmin): Promise<IAdmin> {
    try {
      const updatedAdmin = await this.prisma.admin.update({
        where: { id: Number(id) },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
          ...(data.password && { password: data.password }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      });

      return this.transformTimestamps(updatedAdmin);
    } catch (error) {
      throw new AppError(
        'admin-repository.updateAdmin',
        500,
        'could not update admin data',
      );
    }
  }

  async deleteAdmin(id: string): Promise<IAdmin> {
    try {
      const admin = await this.prisma.admin.delete({
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      });

      return this.transformTimestamps(admin);
    } catch (error) {
      throw new AppError(
        'admin-repository.deleteAdmin',
        500,
        'could not delete admin',
      );
    }
  }
}
