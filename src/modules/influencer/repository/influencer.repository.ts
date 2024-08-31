import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { IInfluencerRepository } from '../interfaces/repository.interface';
import { Influencer } from '@prisma/client';
import { ICreateInfluencer } from '../interfaces/influencer.interface';

@Injectable()
export class InfluencerRepository implements IInfluencerRepository<Influencer> {
  constructor(private prisma: PrismaService) {}

  async createInfluencer(data: ICreateInfluencer): Promise<Influencer> {
    const influencerData = {
      name: data.name,
      username: data.username,
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
      console.log(error);
      throw new AppError(
        'influencer-repository.findOneInfluencer',
        500,
        'could not get influencer details',
      );
    }
  }
}
