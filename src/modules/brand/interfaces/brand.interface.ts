export interface IBrand {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBrandDetails {
  id: number;
  name: string;
  description: string;
  niches: string[];
  createdAt: Date;
  updatedAt: Date;
}
