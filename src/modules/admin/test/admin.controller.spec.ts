import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../admin.controller';
import { CreateAdminService } from '../services/create-admin.service';
import { MockCreateAdmin, MockIAdmin } from './mocks/admin.mock';

describe('AdminController', () => {
  let controller: AdminController;
  let createAdmin: CreateAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: CreateAdminService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIAdmin),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    createAdmin = module.get<CreateAdminService>(CreateAdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create admin user', () => {
    it('should create a new admin user successfully', async () => {
      const result = await controller.create(MockCreateAdmin);

      expect(createAdmin.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });
  });
});
