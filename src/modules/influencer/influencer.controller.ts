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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AppError } from '../../common/errors/Error';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { CreateInfluencerService } from './services/create-influencer.service';
import { FindAllInfluencersService } from './services/find-all-influencers.service';
import { FindOneInfluencerService } from './services/find-one-influencer.service';
import { UpdateInfluencerService } from './services/update-influencer.service';
import { InfluencersByFilterService } from './services/find-influencers-by-filter.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import {
  IInfluencer,
  IInfluencerDetails,
  IInfluencerFilters,
} from './interfaces/influencer.interface';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('influencer')
export class InfluencerController {
  constructor(
    private readonly createInfluencer: CreateInfluencerService,
    private readonly findAllInfluencers: FindAllInfluencersService,
    private readonly findOneInfluencer: FindOneInfluencerService,
    private readonly updateInfluencer: UpdateInfluencerService,
    private readonly influencersByFilter: InfluencersByFilterService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() body: CreateInfluencerDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IInfluencerDetails> {
    return await this.createInfluencer.execute(body, file);
  }

  @Get('/all')
  async findAll(): Promise<IInfluencer[]> {
    return await this.findAllInfluencers.execute();
  }

  @Get('/filter')
  async findInfluencerByFilter(
    @Query() filter: IInfluencerFilters,
  ): Promise<IInfluencerDetails[]> {
    return await this.influencersByFilter.execute(filter);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<IInfluencerDetails> {
    return await this.findOneInfluencer.execute(id);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateInfluencerDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IInfluencerDetails> {
    return await this.updateInfluencer.execute(id, body, file);
  }

  @Delete(':id')
  remove() {
    return 'this.influencerService.remove(+id)';
  }
}
