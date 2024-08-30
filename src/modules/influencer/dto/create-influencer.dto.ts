import {
  IsArray,
  IsEnum,
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Niche } from '../enums/niche.enum';

export class CreateInfluencerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  reach: number;

  @IsString()
  photo?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Niche, {
    each: true,
    message: 'Each niche must be one of the predefined values',
  })
  niches: Niche[];

  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  number: string;
}
