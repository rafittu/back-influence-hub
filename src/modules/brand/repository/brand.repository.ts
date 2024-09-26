import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { IBrandRepository } from '../interfaces/repository.interface';
import { Brand, InfluencerBrand } from '@prisma/client';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { IUpdateBrand } from '../interfaces/brand.interface';

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
          'brand-repository.createBrand',
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

  async findInfluencersByBrand(brandName: string): Promise<InfluencerBrand[]> {
    try {
      const brandInfluencers = await this.prisma.influencerBrand.findMany({
        where: {
          brand: {
            name: brandName,
          },
        },
        include: {
          influencer: {
            include: {
              Niche: {
                include: { niche: true },
              },
            },
          },
          brand: {
            include: {
              BrandNiche: {
                include: { niche: true },
              },
            },
          },
        },
      });

      return brandInfluencers;
    } catch (error) {
      throw new AppError(
        'brand-repository.findInfluencersByBrand',
        500,
        'could not get influencers',
      );
    }
  }

  async findOneBrand(id: string): Promise<Brand> {
    const brandId = Number(Object.values(id));

    try {
      const brand = await this.prisma.brand.findFirst({
        where: { id: brandId },
        include: {
          BrandNiche: {
            select: {
              niche: {
                select: { name: true },
              },
            },
          },
        },
      });

      return brand;
    } catch (error) {
      throw new AppError(
        'brand-repository.findOneBrand',
        500,
        'could not get brand details',
      );
    }
  }

  async updateBrand(id: string, data: IUpdateBrand): Promise<Brand> {
    const brandId = Number(Object.values(id));

    try {
      const updatedBrand = await this.prisma.brand.update({
        where: { id: brandId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.niches && {
            BrandNiche: {
              deleteMany: {},
              create: data.niches.map((niche) => ({
                niche: {
                  connectOrCreate: {
                    where: { name: niche },
                    create: { name: niche },
                  },
                },
              })),
            },
          }),
        },
        include: {
          BrandNiche: {
            include: {
              niche: { select: { name: true } },
            },
          },
        },
      });

      return updatedBrand;
    } catch (error) {
      throw new AppError(
        'brand-repository.updateBrand',
        500,
        'could not update brand details',
      );
    }
  }

  async associateInfluencer(
    brandId: string,
    influencerId: string,
  ): Promise<InfluencerBrand> {
    const brandIdInt = Number(Object.values(brandId));
    const influencerIdInt = Number(Object.values(influencerId));

    try {
      const influencerBrand = await this.prisma.influencerBrand.create({
        data: {
          influencer: {
            connect: { id: influencerIdInt },
          },
          brand: {
            connect: { id: brandIdInt },
          },
        },
        include: {
          influencer: {
            include: {
              Niche: {
                include: { niche: true },
              },
            },
          },
          brand: {
            include: {
              BrandNiche: {
                include: {
                  niche: true,
                },
              },
            },
          },
        },
      });

      return influencerBrand;
    } catch (error) {
      throw new AppError(
        'brand-repository.associateInfluencer',
        500,
        'could not link brand with influencer',
      );
    }
  }

  async disassociateInfluencer(
    brandId: string,
    influencerId: string,
  ): Promise<void> {
    const brandIdInt = Number(Object.values(brandId));
    const influencerIdInt = Number(Object.values(influencerId));

    try {
      await this.prisma.influencerBrand.delete({
        where: {
          influencer_id_brand_id: {
            influencer_id: influencerIdInt,
            brand_id: brandIdInt,
          },
        },
      });
    } catch (error) {
      throw new AppError(
        'brand-repository.disassociateInfluencer',
        500,
        'could not unlink influencer from brand',
      );
    }
  }
}
