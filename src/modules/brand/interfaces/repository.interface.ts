import { CreateBrandDto } from '../dto/create-brand.dto';

export interface IBrandRepository<Brand> {
  createBrand(data: CreateBrandDto): Promise<Brand>;
}
