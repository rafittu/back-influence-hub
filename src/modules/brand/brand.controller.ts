import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseFilters,
  Body,
} from '@nestjs/common';
import { AppError } from 'src/common/errors/Error';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateBrandService } from './services/create-brand.service';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('brand')
export class BrandController {
  constructor(private readonly createBrand: CreateBrandService) {}

  @Post('/create')
  async create(@Body() body: CreateBrandDto) {
    return await this.createBrand.execute(body);
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
