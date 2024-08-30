import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { AppError } from '../../common/errors/Error';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('influencer')
export class InfluencerController {
  constructor() {}

  @Post()
  create() {
    return 'this.influencerService.create(createInfluencerDto)';
  }

  @Get()
  findAll() {
    return 'this.influencerService.findAll()';
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
