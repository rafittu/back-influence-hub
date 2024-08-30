import { Module } from '@nestjs/common';
import { InfluencerController } from './influencer.controller';

@Module({
  controllers: [InfluencerController],
  providers: [],
})
export class InfluencerModule {}
