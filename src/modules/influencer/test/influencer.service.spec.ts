import { Test, TestingModule } from '@nestjs/testing';
import { CreateInfluencerService } from '../services/create-influencer.service';
import { FindAllInfluencersService } from '../services/find-all-influencers.service';
import { FindOneInfluencerService } from '../services/find-one-influencer.service';
import { InfluencersByFilterService } from '../services/find-influencers-by-filter.service';
import { UpdateInfluencerService } from '../services/update-influencer.service';
import { S3BucketService } from '../../../common/aws/s3Bucket';
import { InfluencerRepository } from '../repository/influencer.repository';
import axios from 'axios';
import {
  MockCreateInfluencer,
  MockIInfluencer,
  MockIInfluencerDetails,
  MockInfluencerFilter,
  MockInfluencerPhotoFile,
  MockPrismaInfluencer,
} from './mocks/influencer.mock';
import { AppError } from '../../../common/errors/Error';
import { DeleteInfluencerService } from '../services/delete-influencer.service';

jest.mock('axios');

describe('InfluencerServices', () => {
  let createInfluencer: CreateInfluencerService;
  let findAllInfluencers: FindAllInfluencersService;
  let findOneInfluencer: FindOneInfluencerService;
  let findInfluencerByFilter: InfluencersByFilterService;
  let updateInfluencer: UpdateInfluencerService;
  let deleteInfluencer: DeleteInfluencerService;

  let s3Bucket: S3BucketService;
  let influencerRepository: InfluencerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateInfluencerService,
        FindAllInfluencersService,
        FindOneInfluencerService,
        InfluencersByFilterService,
        UpdateInfluencerService,
        DeleteInfluencerService,
        {
          provide: S3BucketService,
          useValue: {
            uploadImage: jest.fn().mockResolvedValue('image_url'),
            deleteImage: jest.fn(),
          },
        },
        {
          provide: InfluencerRepository,
          useValue: {
            createInfluencer: jest.fn().mockResolvedValue({
              ...MockIInfluencerDetails,
              created_at: MockIInfluencerDetails.createdAt,
              updated_at: MockIInfluencerDetails.updatedAt,
            }),
            findAllInfluencers: jest.fn().mockResolvedValue([
              {
                ...MockIInfluencer,
                created_at: MockIInfluencer.createdAt,
                updated_at: MockIInfluencer.updatedAt,
              },
            ]),
            findInfluencerByFilter: jest
              .fn()
              .mockResolvedValue([MockPrismaInfluencer]),
            findOneInfluencer: jest
              .fn()
              .mockResolvedValue(MockPrismaInfluencer),
            updateInfluencer: jest.fn().mockResolvedValue(MockPrismaInfluencer),
            deleteInfluencer: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    createInfluencer = module.get<CreateInfluencerService>(
      CreateInfluencerService,
    );
    findAllInfluencers = module.get<FindAllInfluencersService>(
      FindAllInfluencersService,
    );
    findOneInfluencer = module.get<FindOneInfluencerService>(
      FindOneInfluencerService,
    );
    findInfluencerByFilter = module.get<InfluencersByFilterService>(
      InfluencersByFilterService,
    );
    updateInfluencer = module.get<UpdateInfluencerService>(
      UpdateInfluencerService,
    );
    deleteInfluencer = module.get<DeleteInfluencerService>(
      DeleteInfluencerService,
    );

    s3Bucket = module.get<S3BucketService>(S3BucketService);
    influencerRepository =
      module.get<InfluencerRepository>(InfluencerRepository);
  });

  it('should be defined', () => {
    expect(createInfluencer).toBeDefined();
    expect(findAllInfluencers).toBeDefined();
    expect(findOneInfluencer).toBeDefined();
    expect(findInfluencerByFilter).toBeDefined();
    expect(updateInfluencer).toBeDefined();
    expect(deleteInfluencer).toBeDefined();
    expect(s3Bucket).toBeDefined();
  });

  describe('create influencer service', () => {
    it('should create a new influencer successfully', async () => {
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockResolvedValueOnce({
        data: {
          logradouro: MockIInfluencerDetails.address.street,
          localidade: MockIInfluencerDetails.address.city,
          uf: MockIInfluencerDetails.address.state,
        },
      });

      const result = await createInfluencer.execute(
        MockCreateInfluencer,
        MockInfluencerPhotoFile,
      );

      expect(s3Bucket.uploadImage).toHaveBeenCalledTimes(1);
      expect(influencerRepository.createInfluencer).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIInfluencerDetails);
    });

    it('should throw an error if zip code is invalid', async () => {
      const invalidZipCode = {
        ...MockCreateInfluencer,
        zipCode: 'invalid_zip',
      };

      try {
        await createInfluencer.execute(invalidZipCode, MockInfluencerPhotoFile);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('invalid zipcode format');
      }
    });

    it('should throw an error if address fetching fails', async () => {
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockRejectedValueOnce(new Error());

      try {
        await createInfluencer.execute(
          MockCreateInfluencer,
          MockInfluencerPhotoFile,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('error fetching address from ViaCEP');
      }
    });

    it('should throw an AppError if axios call failed', async () => {
      const zipCode = '12345678';
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: { erro: true },
      });

      try {
        await createInfluencer['getAddress'](zipCode);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('error fetching address from ViaCEP');
        expect(error.code).toBe(400);
      }
    });

    it('should throw an error if creating influencer fails', async () => {
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockResolvedValueOnce({
        data: {
          logradouro: MockIInfluencerDetails.address.street,
          localidade: MockIInfluencerDetails.address.city,
          uf: MockIInfluencerDetails.address.state,
        },
      });

      jest
        .spyOn(influencerRepository, 'createInfluencer')
        .mockRejectedValueOnce(new Error());

      try {
        await createInfluencer.execute(
          MockCreateInfluencer,
          MockInfluencerPhotoFile,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to create influencer');
      }
    });
  });

  describe('find all influencers', () => {
    it('should find and list all influencers successfully', async () => {
      const result = await findAllInfluencers.execute();

      expect(influencerRepository.findAllInfluencers).toHaveBeenCalledTimes(1);
      expect(result).toEqual([MockIInfluencer]);
    });

    it(`should throw an AppError`, async () => {
      jest
        .spyOn(influencerRepository, 'findAllInfluencers')
        .mockRejectedValueOnce(new AppError());

      try {
        await findAllInfluencers.execute();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get influencers');
      }
    });
  });

  describe('find influencer by id', () => {
    it('should find an influencer by id successfully', async () => {
      const result = await findOneInfluencer.execute(
        String(MockIInfluencerDetails.id),
      );

      expect(influencerRepository.findOneInfluencer).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIInfluencerDetails);
    });

    it(`should throw an AppError`, async () => {
      jest
        .spyOn(influencerRepository, 'findOneInfluencer')
        .mockRejectedValueOnce(new AppError());

      try {
        await findOneInfluencer.execute(String(MockIInfluencerDetails.id));
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get influencer data');
      }
    });
  });

  describe('find influencers by filter', () => {
    it('should find influencers by filter successfully', async () => {
      const result = await findInfluencerByFilter.execute(MockInfluencerFilter);

      expect(influencerRepository.findInfluencerByFilter).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toEqual([MockIInfluencerDetails]);
    });

    it('should split niche string into an array and filter successfully', async () => {
      const nicheString = MockCreateInfluencer.niches.join(', ');
      const MockInfluencerFilterWithStringNiche = {
        niche: nicheString,
      };

      const result = await findInfluencerByFilter.execute(
        MockInfluencerFilterWithStringNiche as unknown,
      );

      expect(influencerRepository.findInfluencerByFilter).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toEqual([MockIInfluencerDetails]);
    });

    it(`should throw an AppError`, async () => {
      jest
        .spyOn(influencerRepository, 'findInfluencerByFilter')
        .mockRejectedValueOnce(new AppError());

      try {
        await findInfluencerByFilter.execute(MockInfluencerFilter);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get influencers');
      }
    });
  });

  describe('update influencer', () => {
    it('should update an influencer successfully', async () => {
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockResolvedValueOnce({
        data: {
          logradouro: MockIInfluencerDetails.address.street,
          localidade: MockIInfluencerDetails.address.city,
          uf: MockIInfluencerDetails.address.state,
        },
      });

      const result = await updateInfluencer.execute(
        String(MockIInfluencerDetails.id),
        {
          ...MockCreateInfluencer,
          zipCode: MockCreateInfluencer.zipCode,
          oldPhoto: 'bucket-image-url',
        },
        MockInfluencerPhotoFile,
      );

      expect(s3Bucket.uploadImage).toHaveBeenCalledTimes(1);
      expect(influencerRepository.updateInfluencer).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIInfluencerDetails);
    });

    it('should throw an error if zip code is invalid', async () => {
      try {
        await updateInfluencer.execute(
          String(MockIInfluencerDetails.id),
          {
            ...MockCreateInfluencer,
            zipCode: 'invalid_zip',
            oldPhoto: 'bucket-image-url',
          },
          MockInfluencerPhotoFile,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('invalid zipcode format');
      }
    });

    it('should throw an error if address fetching fails', async () => {
      const zipCode = '12345678';
      jest.spyOn(axios, 'get').mockResolvedValue({
        data: { erro: true },
      });

      try {
        await updateInfluencer['getAddress'](zipCode);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('error fetching address from ViaCEP');
        expect(error.code).toBe(400);
      }
    });

    it('should throw an error if updating influencer fails', async () => {
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockResolvedValueOnce({
        data: {
          logradouro: MockIInfluencerDetails.address.street,
          localidade: MockIInfluencerDetails.address.city,
          uf: MockIInfluencerDetails.address.state,
        },
      });

      jest
        .spyOn(influencerRepository, 'updateInfluencer')
        .mockRejectedValueOnce(new Error());

      try {
        await updateInfluencer.execute(
          String(MockIInfluencerDetails.id),
          {
            ...MockCreateInfluencer,
            zipCode: MockCreateInfluencer.zipCode,
            oldPhoto: 'bucket-image-url',
          },
          MockInfluencerPhotoFile,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to update influencer data');
      }
    });
  });

  describe('delete influencer', () => {
    it('should delete influencer successfully', async () => {
      await deleteInfluencer.execute(String(MockIInfluencer.id));

      expect(influencerRepository.deleteInfluencer).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if could not delete influencer', async () => {
      jest
        .spyOn(influencerRepository, 'deleteInfluencer')
        .mockRejectedValueOnce(new Error());

      try {
        await deleteInfluencer.execute(String(MockIInfluencer.id));
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to delete influencer');
      }
    });
  });
});
