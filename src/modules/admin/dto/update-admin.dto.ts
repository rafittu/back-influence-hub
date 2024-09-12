import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from './decorators/match.decorator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsOptional()
  @IsString()
  @MaxLength(370)
  name?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(250)
  @Matches(
    /[a-z0-9!#$%&’*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&’*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    {
      message: 'must be a valid email',
    },
  )
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter and one number or symbol',
  })
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @Match('password', { message: 'passwords do not match' })
  passwordConfirmation?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @Match('password', { message: 'passwords do not match' })
  oldPassword?: string;
}
