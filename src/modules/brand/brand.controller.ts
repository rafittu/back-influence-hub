import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseFilters,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AppError } from 'src/common/errors/Error';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateBrandService } from './services/create-brand.service';
import { FindAllBrandsService } from './services/find-all-brands.service';
import { FindOneBrandService } from './services/find-one-brand.service';
import { UpdateBrandService } from './services/update-brand.service';
import { LinkInfluencerService } from './services/link-influencer.service';
import {
  IBrand,
  IBrandDetails,
  IBrandInfluencer,
} from './interfaces/brand.interface';
import { UpdateBrandDto } from './dto/update-brand.dto';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('brand')
export class BrandController {
  constructor(
    private readonly createBrand: CreateBrandService,
    private readonly findAllBrands: FindAllBrandsService,
    private readonly findOneBrand: FindOneBrandService,
    private readonly updateBrand: UpdateBrandService,
    private readonly linkInfluencer: LinkInfluencerService,
  ) {}

  @Post('/create')
  async create(@Body() body: CreateBrandDto): Promise<IBrand> {
    return await this.createBrand.execute(body);
  }

  @Post('/associate-influencer')
  async associateInfluencer(
    @Query('influencerId') influencerId: string,
    @Query('brandId') brandId: string,
  ): Promise<IBrandInfluencer> {
    return await this.linkInfluencer.execute(brandId, influencerId);
  }

  @Get('/')
  async findAll(): Promise<IBrand[]> {
    return await this.findAllBrands.execute();
  }

  @Get('/:id')
  async findOne(@Param() id: string): Promise<IBrandDetails> {
    return await this.findOneBrand.execute(id);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBrandDto,
  ): Promise<IBrandDetails> {
    return await this.updateBrand.execute(id, body);
  }

  @Delete(':id')
  remove() {
    return 'this.brandService.remove(+id)';
  }
}
