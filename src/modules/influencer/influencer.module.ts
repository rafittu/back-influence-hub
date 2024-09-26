import { Module } from '@nestjs/common';
import { InfluencerController } from './influencer.controller';
import { CreateInfluencerService } from './services/create-influencer.service';
import { InfluencerRepository } from './repository/influencer.repository';
import { PrismaService } from 'src/prisma.service';
import { FindAllInfluencersService } from './services/find-all-influencers.service';
import { FindOneInfluencerService } from './services/find-one-influencer.service';
import { UpdateInfluencerService } from './services/update-influencer.service';
import { InfluencersByFilterService } from './services/find-influencers-by-filter.service';
import { S3BucketService } from 'src/common/aws/s3Bucket';
import { DeleteInfluencerService } from './services/delete-influencer.service';

@Module({
  controllers: [InfluencerController],
  providers: [
    PrismaService,
    S3BucketService,
    InfluencerRepository,
    CreateInfluencerService,
    FindAllInfluencersService,
    FindOneInfluencerService,
    UpdateInfluencerService,
    InfluencersByFilterService,
    DeleteInfluencerService,
  ],
})
export class InfluencerModule {}
