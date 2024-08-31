import {
  IsArray,
  IsEnum,
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Niche } from '../../../modules/influencer/enums/niche.enum';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Niche, {
    each: true,
    message: 'Each niche must be one of the predefined values',
  })
  niches: Niche[];
}
