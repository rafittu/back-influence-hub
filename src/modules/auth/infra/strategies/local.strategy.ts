import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CredentialsDto } from '../../dto/credentials.dto';
import { SignInService } from '../../services/signin.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private signInService: SignInService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const credentials: CredentialsDto = {
      email,
      password,
    };
    return await this.signInService.validateUser(credentials);
  }
}
