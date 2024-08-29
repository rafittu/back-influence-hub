import { Test, TestingModule } from '@nestjs/testing';
import { CreateAdminService } from '../services/create-admin.service';
import { SecurityService } from '../../../common/services/security.service';
import { AdminRepository } from '../repository/admin.repository';
import { MockAdmin, MockCreateAdmin, MockIAdmin } from './mocks/admin.mock';

describe('AdminServices', () => {
  let createAdmin: CreateAdminService;

  let securityService: SecurityService;
  let adminRepository: AdminRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAdminService,
        SecurityService,
        {
          provide: AdminRepository,
          useValue: {
            createAdmin: jest.fn().mockResolvedValue({
              ...MockAdmin,
              password: undefined,
            }),
          },
        },
      ],
    }).compile();

    createAdmin = module.get<CreateAdminService>(CreateAdminService);

    securityService = module.get<SecurityService>(SecurityService);
    adminRepository = module.get<AdminRepository>(AdminRepository);
  });

  it('should be defined', () => {
    expect(createAdmin).toBeDefined();
  });

  describe('create user', () => {
    it('should create a new user successfully', async () => {
      jest
        .spyOn(securityService, 'hashPassword')
        .mockResolvedValueOnce({ hashedPassword: 'hashedPassword' });
      jest.spyOn(createAdmin as unknown as never, 'transformTimestamps');

      const result = await createAdmin.execute(MockCreateAdmin);

      expect(securityService.hashPassword).toHaveBeenCalledTimes(1);
      expect(adminRepository.createAdmin).toHaveBeenCalledTimes(1);
      expect(createAdmin['transformTimestamps']).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });
  });
});
