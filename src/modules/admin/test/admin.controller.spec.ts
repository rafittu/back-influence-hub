import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../admin.controller';
import { CreateAdminService } from '../services/create-admin.service';
import {
  MockCreateAdmin,
  MockIAdmin,
  MockUpdateAdmin,
} from './mocks/admin.mock';
import { FindAllAdminsService } from '../services/all-admins.service';
import { FindOneAdminService } from '../services/find-one-admin.service';
import { UpdateAdminService } from '../services/update-admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let createAdmin: CreateAdminService;
  let listAllAdmins: FindAllAdminsService;
  let findOneAdmin: FindOneAdminService;
  let updateAdmin: UpdateAdminService;

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
        {
          provide: FindAllAdminsService,
          useValue: {
            execute: jest.fn().mockResolvedValue([MockIAdmin]),
          },
        },
        {
          provide: FindOneAdminService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIAdmin),
          },
        },
        {
          provide: UpdateAdminService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIAdmin),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    createAdmin = module.get<CreateAdminService>(CreateAdminService);
    listAllAdmins = module.get<FindAllAdminsService>(FindAllAdminsService);
    findOneAdmin = module.get<FindOneAdminService>(FindOneAdminService);
    updateAdmin = module.get<UpdateAdminService>(UpdateAdminService);
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

  describe('list all admins', () => {
    it('should find and list all admins successfully', async () => {
      const result = await controller.findAll();

      expect(listAllAdmins.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockIAdmin]);
    });
  });

  describe('find one admin', () => {
    it('should find and list one admin successfully', async () => {
      const result = await controller.findOne(String(MockIAdmin.id));

      expect(findOneAdmin.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });
  });

  describe('update admin', () => {
    it('should update an admin successfully', async () => {
      const result = await controller.update(
        String(MockIAdmin.id),
        MockUpdateAdmin,
      );

      MockIAdmin.email = MockUpdateAdmin.email;

      expect(updateAdmin.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIAdmin);
    });
  });
});
