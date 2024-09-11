import { IAdmin, ICreateAdmin } from './admin.interface';

export interface IAdminRepository<Admin> {
  createAdmin(data: ICreateAdmin): Promise<Admin>;
  findAllAdmins(): Promise<IAdmin[]>;
  findOneAdmin(id: string): Promise<IAdmin>;
}
