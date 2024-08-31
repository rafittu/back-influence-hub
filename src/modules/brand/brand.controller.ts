import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { AppError } from 'src/common/errors/Error';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('brand')
export class BrandController {
  constructor() {}

  @Post()
  create() {
    return 'this.brandService.create(createBrandDto)';
  }

  @Get()
  findAll() {
    return 'this.brandService.findAll()';
  }

  @Get(':id')
  findOne() {
    return 'this.brandService.findOne(+id)';
  }

  @Patch(':id')
  update() {
    return 'this.brandService.update(+id, updateBrandDto)';
  }

  @Delete(':id')
  remove() {
    return 'this.brandService.remove(+id)';
  }
}
