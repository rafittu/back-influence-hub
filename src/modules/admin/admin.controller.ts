import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('admin')
export class AdminController {
  constructor() {}

  @Post()
  create() {
    return 'this.adminService.create(body)';
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
