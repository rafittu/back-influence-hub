import { Module } from '@nestjs/common';
import { InfluencerController } from './influencer.controller';
import { CreateInfluencerService } from './services/create-influencer.service';
import { InfluencerRepository } from './repository/influencer.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [InfluencerController],
  providers: [PrismaService, InfluencerRepository, CreateInfluencerService],
})
export class InfluencerModule {}
