import { ICreateInfluencer } from './influencer.interface';

export interface IInfluencerRepository<Influencer> {
  createInfluencer(data: ICreateInfluencer): Promise<Influencer>;
  findAllInfluencers();
}
