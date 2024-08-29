import { ICreateAdmin } from './admin.interface';

export interface IAdminRepository<Admin> {
  createAdmin(data: ICreateAdmin): Promise<Admin>;
}
