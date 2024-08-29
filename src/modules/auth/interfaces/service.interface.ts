import { Request } from 'express';

export interface IUserPayload {
  id: number;
  name: string;
  email: string;
}

export interface IAuthRequest extends Request {
  user: IUserPayload;
}

export interface IJtwPayload {
  sub: number;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}
