import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../../prisma.service';
import { AdminRepository } from './repository/admin.repository';
import { SecurityService } from '../../common/services/security.service';
import { CreateAdminService } from './services/create-admin.service';

@Module({
  controllers: [AdminController],
  providers: [
    PrismaService,
    AdminRepository,
    SecurityService,
    CreateAdminService,
  ],
})
export class AdminModule {}
