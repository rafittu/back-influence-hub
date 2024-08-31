import { ICreateInfluencer, IUpdateInfluencer } from './influencer.interface';

export interface IInfluencerRepository<Influencer> {
  createInfluencer(data: ICreateInfluencer): Promise<Influencer>;
  findAllInfluencers(): Promise<Influencer[]>;
  findOneInfluencer(id: string): Promise<Influencer>;
  updateInfluencer(id: string, data: IUpdateInfluencer): Promise<Influencer>;
}
