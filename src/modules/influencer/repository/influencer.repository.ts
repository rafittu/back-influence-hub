import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { IInfluencerRepository } from '../interfaces/repository.interface';
import { Influencer } from '@prisma/client';
import {
  ICreateInfluencer,
  IInfluencerFilters,
  IUpdateInfluencer,
} from '../interfaces/influencer.interface';

@Injectable()
export class InfluencerRepository implements IInfluencerRepository<Influencer> {
  constructor(private prisma: PrismaService) {}

  async createInfluencer(data: ICreateInfluencer): Promise<Influencer> {
    const influencerData = {
      name: data.name,
      username: data.username,
      email: data.email,
      reach: data.reach,
      photo: data.photo,
    };
    const influencerAddress = {
      number: data.number,
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
    };
    const influencerNiches = data.niches;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const influencer = await prisma.influencer.create({
          data: {
            ...influencerData,
            InfluencerAddress: {
              create: influencerAddress,
            },
          },
        });

        await Promise.all(
          influencerNiches.map(async (nicheName) => {
            await prisma.influencerNiche.create({
              data: {
                influencer: {
                  connect: { id: influencer.id },
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

        return influencer;
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(
          'influencer-repository.createInfluencer',
          409,
          `${error.meta.target[0]} already taken`,
        );
      }

      throw new AppError(
        'influencer-repository.createInfluencer',
        500,
        'influencer not created',
      );
    }
  }

  async findAllInfluencers(): Promise<Influencer[]> {
    try {
      return await this.prisma.influencer.findMany();
    } catch (error) {
      throw new AppError(
        'influencer-repository.findAllInfluencers',
        500,
        'could not get influencers',
      );
    }
  }

  async findInfluencerByFilter(
    filter: IInfluencerFilters,
  ): Promise<Influencer[]> {
    const { reachMin, reachMax, niche, city } = filter;

    try {
      const influencers = await this.prisma.influencer.findMany({
        where: {
          AND: [
            reachMin !== undefined ? { reach: { gte: Number(reachMin) } } : {},
            reachMax !== undefined ? { reach: { lte: Number(reachMax) } } : {},
            niche
              ? {
                  Niche: {
                    some: {
                      niche: { name: niche },
                    },
                  },
                }
              : {},
            city
              ? {
                  InfluencerAddress: {
                    some: { city },
                  },
                }
              : {},
          ],
        },
        include: {
          InfluencerAddress: true,
          Niche: {
            include: {
              niche: { select: { name: true } },
            },
          },
        },
      });

      return influencers;
    } catch (error) {
      throw new AppError(
        'influencer-repository.findInfluencersByFilter',
        500,
        'could not get influencers',
      );
    }
  }

  async findOneInfluencer(id: string): Promise<Influencer> {
    const influencerId = Number(Object.values(id));

    try {
      const influencer = await this.prisma.influencer.findFirst({
        where: { id: influencerId },
        include: {
          InfluencerAddress: true,
          Niche: {
            select: {
              niche: {
                select: { name: true },
              },
            },
          },
        },
      });

      return influencer;
    } catch (error) {
      throw new AppError(
        'influencer-repository.findOneInfluencer',
        500,
        'could not get influencer details',
      );
    }
  }

  async updateInfluencer(
    id: string,
    data: IUpdateInfluencer,
  ): Promise<Influencer> {
    const influencerId = Number(Object.values(id));

    try {
      const influencerAddressId = await this.prisma.influencerAddress.findFirst(
        { where: { influencer_id: influencerId }, select: { id: true } },
      );

      const updatedInfluencer = await this.prisma.influencer.update({
        where: { id: influencerId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.username && { username: data.username }),
          ...(data.email && { email: data.email }),
          ...(data.reach && { reach: data.reach }),
          ...(data.photo && { photo: data.photo }),
          ...(data.zipCode && {
            InfluencerAddress: {
              update: {
                where: { id: influencerAddressId.id },
                data: {
                  street: data.street,
                  number: data.number,
                  city: data.city,
                  state: data.state,
                  zipCode: data.zipCode,
                },
              },
            },
          }),
          ...(data.niches && {
            Niche: {
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
          InfluencerAddress: true,
          Niche: {
            include: {
              niche: { select: { name: true } },
            },
          },
        },
      });

      return updatedInfluencer;
    } catch (error) {
      throw new AppError(
        'influencer-repository.updateInfluencer',
        500,
        'could not update influencer details',
      );
    }
  }
}
