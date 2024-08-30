import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseFilters,
  Body,
} from '@nestjs/common';
import { AppError } from '../../common/errors/Error';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { CreateInfluencerService } from './services/create-influencer.service';
import { FindAllInfluencersServices } from './services/find-all-influencers.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { IInfluencerDetails } from './interfaces/influencer.interface';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('influencer')
export class InfluencerController {
  constructor(
    private readonly createInfluencer: CreateInfluencerService,
    private readonly findAllInfluencers: FindAllInfluencersServices,
  ) {}

  @Post('/create')
  async create(@Body() body: CreateInfluencerDto): Promise<IInfluencerDetails> {
    return await this.createInfluencer.execute(body);
  }

  @Get('/all')
  async findAll() {
    return await this.findAllInfluencers.execute();
  }

  @Get(':id')
  findOne() {
    return 'this.influencerService.findOne(+id)';
  }

  @Patch(':id')
  update() {
    return 'this.influencerService.update(+id, updateInfluencerDto)';
  }

  @Delete(':id')
  remove() {
    return 'this.influencerService.remove(+id)';
  }
}
