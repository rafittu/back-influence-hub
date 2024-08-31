import { PartialType } from '@nestjs/mapped-types';
import { CreateInfluencerDto } from './create-influencer.dto';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Niche } from '../enums/niche.enum';

export class UpdateInfluencerDto extends PartialType(CreateInfluencerDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  reach: number;

  @IsOptional()
  @IsString()
  photo?: string;

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
