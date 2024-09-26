import {
  ICreateInfluencer,
  IInfluencerFilters,
  IUpdateInfluencer,
} from './influencer.interface';

export interface IInfluencerRepository<Influencer> {
  createInfluencer(data: ICreateInfluencer): Promise<Influencer>;
  findAllInfluencers(): Promise<Influencer[]>;
  findOneInfluencer(id: string): Promise<Influencer>;
  updateInfluencer(id: string, data: IUpdateInfluencer): Promise<Influencer>;
  findInfluencerByFilter(filters: IInfluencerFilters): Promise<Influencer[]>;
  deleteInfluencer(id: string): Promise<void>;
}
