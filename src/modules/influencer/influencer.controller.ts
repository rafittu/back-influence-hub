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
import { AppError } from '../../common/errors/Error';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { CreateInfluencerService } from './services/create-influencer.service';
import { FindAllInfluencersService } from './services/find-all-influencers.service';
import { FindOneInfluencerService } from './services/find-one-influencer.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import {
  IInfluencer,
  IInfluencerDetails,
} from './interfaces/influencer.interface';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('influencer')
export class InfluencerController {
  constructor(
    private readonly createInfluencer: CreateInfluencerService,
    private readonly findAllInfluencers: FindAllInfluencersService,
    private readonly findOneInfluencer: FindOneInfluencerService,
  ) {}

  @Post('/create')
  async create(@Body() body: CreateInfluencerDto): Promise<IInfluencerDetails> {
    return await this.createInfluencer.execute(body);
  }

  @Get('/all')
  async findAll(): Promise<IInfluencer[]> {
    return await this.findAllInfluencers.execute();
  }

  @Get('/:id')
  async findOne(@Param() id: string): Promise<IInfluencerDetails> {
    return await this.findOneInfluencer.execute(id);
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
