import { Test, TestingModule } from '@nestjs/testing';
import { CreateAdminService } from '../services/create-admin.service';
import { SecurityService } from '../../../common/services/security.service';
import { AdminRepository } from '../repository/admin.repository';

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
            createAdmin: jest.fn().mockResolvedValue(''),
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
});
