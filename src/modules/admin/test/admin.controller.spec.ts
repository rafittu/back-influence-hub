import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../admin.controller';
import { CreateAdminService } from '../services/create-admin.service';

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
            execute: jest.fn().mockResolvedValue(''),
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
});
