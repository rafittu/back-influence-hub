import { IAdmin, ICreateAdmin, IUpdateAdmin } from './admin.interface';

export interface IAdminRepository<Admin> {
  createAdmin(data: ICreateAdmin): Promise<Admin>;
  findAllAdmins(): Promise<IAdmin[]>;
  findOneAdmin(id: string): Promise<IAdmin>;
  updateAdmin(id: string, data: IUpdateAdmin): Promise<IAdmin>;
  deleteAdmin(id: string);
}
