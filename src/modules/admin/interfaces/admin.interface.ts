export interface ICreateAdmin {
  name: string;
  email: string;
  password: string;
}

export interface IAdmin {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
