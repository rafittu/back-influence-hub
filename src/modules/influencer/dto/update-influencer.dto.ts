import { PartialType } from '@nestjs/mapped-types';
import { CreateInfluencerDto } from './create-influencer.dto';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Niche } from '../enums/niche.enum';

export class UpdateInfluencerDto extends PartialType(CreateInfluencerDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  oldPhoto: string;

  @IsOptional()
  @IsString()
  @Matches(
    /[a-z0-9!#$%&’*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&’*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    {
      message: 'must be a valid email',
    },
  )
  email: string;

  @IsOptional()
  reach: number;

  @IsOptional()
  @IsArray()
  @IsEnum(Niche, {
    each: true,
    message: 'Each niche must be one of the predefined values',
  })
  niches: Niche[];

  @IsOptional()
  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  number: string;
}
