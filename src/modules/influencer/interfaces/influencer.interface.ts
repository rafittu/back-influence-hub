export interface ICreateInfluencer {
  name: string;
  username: string;
  reach: number;
  photo?: string;
  niches: string[];
  zipCode: string;
  state: string;
  city: string;
  street: string;
  number: string;
}

export interface IInfluencer {
  id: number;
  name: string;
  username: string;
  reach: number;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInfluencerDetails {
  id: number;
  name: string;
  username: string;
  reach: number;
  photo?: string;
  niches: string[];
  address: {
    zipCode: string;
    state: string;
    city: string;
    street: string;
    number: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
