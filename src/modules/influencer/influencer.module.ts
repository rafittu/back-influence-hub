import { Module } from '@nestjs/common';
import { InfluencerController } from './influencer.controller';
import { CreateInfluencerService } from './services/create-influencer.service';

@Module({
  controllers: [InfluencerController],
  providers: [CreateInfluencerService],
})
export class InfluencerModule {}
