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

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('admin')
export class AdminController {
  constructor(private readonly createAdmin: CreateAdminService) {}

  @Post('/signup')
  async create(@Body() body: CreateAdminDto) {
    return await this.createAdmin.execute(body);
  }

  @Get()
  findAll() {
    return 'this.adminService.findAll()';
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
