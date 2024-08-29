import { Injectable } from '@nestjs/common';
import { CredentialsDto } from '../dto/credentials.dto';

@Injectable()
export class SignInService {
  constructor() {}

  async validateUser(credentials: CredentialsDto) {
    try {
    } catch (error) {}
  }
}
