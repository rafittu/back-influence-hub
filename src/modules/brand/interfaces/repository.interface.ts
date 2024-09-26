import { InfluencerBrand } from '@prisma/client';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { IUpdateBrand } from './brand.interface';

export interface IBrandRepository<Brand> {
  createBrand(data: CreateBrandDto): Promise<Brand>;
  findAllBrands(): Promise<Brand[]>;
  findOneBrand(id: string): Promise<Brand>;
  updateBrand(id: string, data: IUpdateBrand): Promise<Brand>;
  associateInfluencer(
    brandId: string,
    influencerId: string,
  ): Promise<InfluencerBrand>;
  findInfluencersByBrand(brandname: string): Promise<InfluencerBrand[]>;
  disassociateInfluencer(brandId: string, influencerId: string): Promise<void>;
}
