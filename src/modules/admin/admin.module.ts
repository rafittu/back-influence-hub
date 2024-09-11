import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../../prisma.service';
import { AdminRepository } from './repository/admin.repository';
import { SecurityService } from '../../common/services/security.service';
import { CreateAdminService } from './services/create-admin.service';
import { FindAllAdminsService } from './services/all-admins.service';
import { FindOneAdminService } from './services/find-one-admin.service';

@Module({
  controllers: [AdminController],
  providers: [
    PrismaService,
    AdminRepository,
    SecurityService,
    CreateAdminService,
    FindAllAdminsService,
    FindOneAdminService,
  ],
})
export class AdminModule {}
