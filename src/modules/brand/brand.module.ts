import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [BrandController],
  providers: [PrismaService],
})
export class BrandModule {}
