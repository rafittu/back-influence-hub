import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseFilters,
  Body,
  Param,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateAdminService } from './services/create-admin.service';
import { IAdmin } from './interfaces/admin.interface';
import { isPublic } from '../auth/infra/decorators/is-public.decorator';
import { FindAllAdminsService } from './services/all-admins.service';
import { FindOneAdminService } from './services/find-one-admin.service';
import { UpdateAdminService } from './services/update-admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('admin')
export class AdminController {
  constructor(
    private readonly createAdmin: CreateAdminService,
    private readonly findAllAdmins: FindAllAdminsService,
    private readonly findOneAdmin: FindOneAdminService,
    private readonly updateAdmin: UpdateAdminService,
  ) {}

  @isPublic()
  @Post('/signup')
  async create(@Body() body: CreateAdminDto): Promise<IAdmin> {
    return await this.createAdmin.execute(body);
  }

  @Get('/')
  async findAll(): Promise<IAdmin[]> {
    return await this.findAllAdmins.execute();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<IAdmin> {
    return await this.findOneAdmin.execute(id);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAdminDto,
  ): Promise<IAdmin> {
    return await this.updateAdmin.execute(id, body);
  }

  @Delete()
  remove() {
    return 'this.adminService.remove(+id)';
  }
}
