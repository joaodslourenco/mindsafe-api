import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { TherapistsRepository } from './therapists.repository';
import { UpdateTherapistDto } from '../dto/update-therapist.dto';
import { CreateTherapistDto } from '../dto/create-therapist.dto';

const newTherapist: CreateTherapistDto = {
  email: 'test@test.com',
  name: 'Test',
  patientId: 'some-id',
};

const testTherapist = {
  id: '538b19e0-9be9-4d04-aa6f-80763784ae2a',
  email: 'pedro@teste.com',
  name: 'Pedro',
  patientId: '59da21dc-0709-4d3e-bdaa-0e9774c1633f',
  patient: {
    name: 'João',
    email: 'joao@teste.com',
  },
};

const arrayOfTherapists = [testTherapist, testTherapist, testTherapist];

describe('TherapistsRepository', () => {
  let therapistsRepository: TherapistsRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TherapistsRepository,
        {
          provide: PrismaService,
          useValue: {
            therapist: {
              create: jest.fn().mockResolvedValue(testTherapist),
              findUnique: jest.fn().mockResolvedValue(testTherapist),
              findMany: jest.fn().mockResolvedValue(arrayOfTherapists),
              update: jest
                .fn()
                .mockImplementation(
                  (id: string, updateDto: UpdateTherapistDto) => ({
                    id,
                    ...updateDto,
                  }),
                )
                .mockResolvedValue({}),
              delete: jest.fn().mockResolvedValue(testTherapist),
            },
          },
        },
      ],
    }).compile();

    therapistsRepository =
      module.get<TherapistsRepository>(TherapistsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(therapistsRepository).toBeDefined();
  });

  describe('create method (POST)', () => {
    it('should return as defined', async () => {
      jest
        .spyOn(prismaService.therapist, 'findUnique')
        .mockResolvedValueOnce(undefined);
      const newUser = await therapistsRepository.create(newTherapist);

      expect(newUser).toBeDefined();
    });

    it('should have called prismaService Create', async () => {
      jest
        .spyOn(prismaService.therapist, 'findUnique')
        .mockResolvedValueOnce(undefined);

      await therapistsRepository.create(newTherapist);
      expect(prismaService.therapist.create).toHaveBeenCalled();
    });

    it('should return the new therapist obj with the same keys', async () => {
      jest
        .spyOn(prismaService.therapist, 'findUnique')
        .mockResolvedValueOnce(undefined);
      const newUser = await therapistsRepository.create(testTherapist);

      expect(Object.keys(newUser)).toEqual(Object.keys(testTherapist));
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.therapist, 'create')
        .mockRejectedValueOnce(new Error());

      expect(therapistsRepository.create(testTherapist)).rejects.toThrowError();
    });
  });

  describe('findOne method (GET)', () => {
    it('should get a therapist', async () => {
      const therapist = await therapistsRepository.findOne(testTherapist.id);

      expect(therapist).toBe(testTherapist);
      expect(prismaService.therapist.findUnique).toHaveBeenCalledWith({
        where: { id: testTherapist.id },
        include: { posts: true, therapists: true },
      });
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.therapist, 'findUnique')
        .mockRejectedValueOnce(new Error());

      expect(
        therapistsRepository.findOne(testTherapist.id),
      ).rejects.toThrowError();
    });
  });

  describe('findAll method (GET)', () => {
    it('should get all therapists', async () => {
      const therapists = await therapistsRepository.findAll();

      expect(therapists).toBe(arrayOfTherapists);
      expect(prismaService.therapist.findMany).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.therapist, 'findMany')
        .mockRejectedValueOnce(new Error());

      expect(therapistsRepository.findAll()).rejects.toThrowError();
    });
  });

  it("should throw an exception when there's an error", () => {
    jest
      .spyOn(prismaService.therapist, 'findUnique')
      .mockRejectedValueOnce(new Error());

    expect(therapistsRepository.findAll()).rejects.toThrowError();
  });

  describe('updateTherapist method (PATCH)', () => {
    it('should update therapist', async () => {
      jest
        .spyOn(prismaService.therapist, 'update')
        .mockResolvedValueOnce({ ...testTherapist, name: 'another name' });

      const updatedTherapist: UpdateTherapistDto = { name: 'another name' };

      const therapist = await therapistsRepository.update(
        testTherapist.id,
        updatedTherapist,
      );

      expect(prismaService.therapist.update).toHaveBeenCalled();
      expect(therapist).toEqual({ ...testTherapist, ...updatedTherapist });
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.therapist, 'update')
        .mockRejectedValueOnce(new Error());

      expect(
        therapistsRepository.update(testTherapist.id, { name: 'another name' }),
      ).rejects.toThrowError();
    });
  });

  describe('deleteTherapist method (DELETE)', () => {
    it("should delete therapist's posts", async () => {
      await therapistsRepository.remove(testTherapist.id);
      expect(prismaService.post.deleteMany).toHaveBeenCalled();
    });

    it("should delete therapist's therapists", async () => {
      await therapistsRepository.remove(testTherapist.id);
      expect(prismaService.therapist.deleteMany).toHaveBeenCalled();
    });

    it('should delete therapist', async () => {
      const therapist = await therapistsRepository.remove(testTherapist.id);

      expect(therapist).toEqual(testTherapist);
      expect(prismaService.therapist.delete).toHaveBeenCalled();
      expect(prismaService.post.deleteMany).toHaveBeenCalled();
      expect(prismaService.therapist.deleteMany).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockRejectedValueOnce(new Error());

      expect(
        therapistsRepository.remove(testTherapist.id),
      ).rejects.toThrowError();
    });
  });
});
