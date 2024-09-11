import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseFilters,
  Body,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateAdminService } from './services/create-admin.service';
import { IAdmin } from './interfaces/admin.interface';
import { isPublic } from '../auth/infra/decorators/is-public.decorator';
import { FindAllAdminsService } from './services/all-admins.service';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('admin')
export class AdminController {
  constructor(
    private readonly createAdmin: CreateAdminService,
    private readonly findAllAdmins: FindAllAdminsService,
  ) {}

  @isPublic()
  @Post('/signup')
  async create(@Body() body: CreateAdminDto): Promise<IAdmin> {
    return await this.createAdmin.execute(body);
  }

  @Get('/')
  async findAll() {
    return await this.findAllAdmins.execute();
  }

  @Get()
  findOne() {
    return 'this.adminService.findOne(+id)';
  }

  @Patch()
  update() {
    return 'this.adminService.update(+id, updateAdminDto)';
  }

  @Delete()
  remove() {
    return 'this.adminService.remove(+id)';
  }
}
