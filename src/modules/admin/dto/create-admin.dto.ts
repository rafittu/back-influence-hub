import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from './decorators/match.decorator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(370)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(250)
  @Matches(
    /[a-z0-9!#$%&’*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&’*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    {
      message: 'must be a valid email',
    },
  )
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter and one number or symbol',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  @Match('password', { message: 'passwords do not match' })
  passwordConfirmation: string;
}
