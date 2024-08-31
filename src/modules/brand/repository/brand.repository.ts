import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { IBrandRepository } from '../interfaces/repository.interface';
import { Brand } from '@prisma/client';
import { CreateBrandDto } from '../dto/create-brand.dto';

@Injectable()
export class BrandRepository implements IBrandRepository<Brand> {
  constructor(private prisma: PrismaService) {}

  async createBrand(data: CreateBrandDto): Promise<Brand> {
    const brandNiches = data.niches;
    delete data.niches;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const brand = await prisma.brand.create({
          data: {
            ...data,
          },
        });

        await Promise.all(
          brandNiches.map(async (nicheName) => {
            await prisma.brandNiche.create({
              data: {
                brand: {
                  connect: { id: brand.id },
                },
                niche: {
                  connectOrCreate: {
                    where: { name: nicheName },
                    create: { name: nicheName },
                  },
                },
              },
            });
          }),
        );

        return brand;
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(
          'influencer-repository.createBrand',
          409,
          `${error.meta.target[0]} already taken`,
        );
      }

      throw new AppError(
        'brand-repository.createBrand',
        500,
        'brand not created',
      );
    }
  }

  async findAllBrands(): Promise<Brand[]> {
    try {
      return await this.prisma.brand.findMany();
    } catch (error) {
      throw new AppError(
        'brand-repository.findAllBrands',
        500,
        'could not get brands',
      );
    }
  }
}
