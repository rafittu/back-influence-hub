import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Niche } from '../../../modules/influencer/enums/niche.enum';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Niche, {
    each: true,
    message: 'Each niche must be one of the predefined values',
  })
  niches: Niche[];
}
