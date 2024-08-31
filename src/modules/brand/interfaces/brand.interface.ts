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

export interface IUpdateBrand {
  name?: string;
  description?: string;
  niches?: string[];
}

export interface IBrandInfluencer {
  id: number;
  influencerId: number;
  brandId: number;
  createdAt: Date;
  updatedAt: Date;
  influencer: {
    id: number;
    name: string;
    username: string;
    reach: number;
  };
  brand: {
    id: number;
    name: string;
    description: string;
  };
  commonNiches: string[];
}
