import { CreateBrandDto } from '../dto/create-brand.dto';
import { IUpdateBrand } from './brand.interface';

export interface IBrandRepository<Brand> {
  createBrand(data: CreateBrandDto): Promise<Brand>;
  findAllBrands(): Promise<Brand[]>;
  findOneBrand(id: string): Promise<Brand>;
  updateBrand(id: string, data: IUpdateBrand): Promise<Brand>;
}
