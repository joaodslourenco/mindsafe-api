import { Test, TestingModule } from '@nestjs/testing';
import { PatientEntity } from '../entities/patient.entity';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientsRepository } from './patients.repository';
import { PrismaService } from 'src/prisma/prisma.service';

const newUserDto = {
  email: 'testpatient@test.com',
  name: 'Test',
  password: '123456',
};

const testPatient: PatientEntity = {
  id: '13216546',
  name: 'test',
  email: 'test@test.com',
  password: '123456',
  createdAt: new Date(),
};
const arrayOfPatients = [testPatient, testPatient, testPatient];

const patientPost = {
  id: 'some-id',
  content: 'hello world',
  createdAt: new Date(),
  patientId: 'some-id',
};
const arrayOfPatientPosts = [patientPost, patientPost, patientPost];

describe('PatientsRepository', () => {
  let patientsRepository: PatientsRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsRepository,
        {
          provide: PrismaService,
          useValue: {
            patient: {
              create: jest.fn().mockResolvedValue(testPatient),
              findUnique: jest.fn().mockResolvedValue(testPatient),
              findMany: jest.fn().mockResolvedValue(arrayOfPatients),
              update: jest
                .fn()
                .mockImplementation(
                  (id: string, updateDto: UpdatePatientDto) => ({
                    id,
                    ...updateDto,
                  }),
                )
                .mockResolvedValue({}),
              delete: jest.fn().mockResolvedValue(testPatient),
            },
            post: {
              deleteMany: jest.fn().mockResolvedValue(testPatient),
            },
            therapist: {
              deleteMany: jest.fn().mockResolvedValue(testPatient),
            },
            $transaction: jest.fn().mockResolvedValue(testPatient),
          },
        },
      ],
    }).compile();

    patientsRepository = module.get<PatientsRepository>(PatientsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(patientsRepository).toBeDefined();
  });

  describe('create method (POST)', () => {
    it('should return as defined', async () => {
      jest
        .spyOn(prismaService.patient, 'findUnique')
        .mockResolvedValueOnce(undefined);
      const newUser = await patientsRepository.create(newUserDto);

      expect(newUser).toBeDefined();
    });

    it('should have called prismaService Create', async () => {
      jest
        .spyOn(prismaService.patient, 'findUnique')
        .mockResolvedValueOnce(undefined);

      await patientsRepository.create(newUserDto);
      expect(prismaService.patient.create).toHaveBeenCalled();
    });

    it('should return the new patient obj with the same keys', async () => {
      jest
        .spyOn(prismaService.patient, 'findUnique')
        .mockResolvedValueOnce(undefined);
      const newUser = await patientsRepository.create(testPatient);

      expect(Object.keys(newUser)).toEqual(Object.keys(testPatient));
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.patient, 'create')
        .mockRejectedValueOnce(new Error());

      expect(patientsRepository.create(testPatient)).rejects.toThrowError();
    });
  });

  describe('findOne method (GET)', () => {
    it('should get an patient', async () => {
      const patient = await patientsRepository.findOne(testPatient.id);

      expect(patient).toBe(testPatient);
      expect(prismaService.patient.findUnique).toHaveBeenCalledWith({
        where: { id: testPatient.id },
        include: { posts: true, therapists: true },
      });
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.patient, 'findUnique')
        .mockRejectedValueOnce(new Error());

      expect(patientsRepository.findOne(testPatient.id)).rejects.toThrowError();
    });
  });

  describe('findAll method (GET)', () => {
    it('should get all patients', async () => {
      const patients = await patientsRepository.findAll();

      expect(patients).toBe(arrayOfPatients);
      expect(prismaService.patient.findMany).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.patient, 'findMany')
        .mockRejectedValueOnce(new Error());

      expect(patientsRepository.findAll()).rejects.toThrowError();
    });
  });

  describe('findAllPostsByPatient method (GET)', () => {
    it('should get all patients', async () => {
      jest
        .spyOn(prismaService.patient, 'findUnique')
        .mockResolvedValueOnce(testPatient);

      const patient = await patientsRepository.findAllPostsByPatient(
        testPatient.id,
      );

      const patientWithPosts = { ...patient, posts: arrayOfPatientPosts };

      expect(patientWithPosts.posts).toEqual(arrayOfPatientPosts);
      expect(prismaService.patient.findUnique).toHaveBeenCalledWith({
        where: { id: testPatient.id },
        include: { posts: true },
      });
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.patient, 'findUnique')
        .mockRejectedValueOnce(new Error());

      expect(
        patientsRepository.findAllPostsByPatient(testPatient.id),
      ).rejects.toThrowError();
    });
  });

  describe('updatePatient method (PATCH)', () => {
    it('should update patient', async () => {
      jest
        .spyOn(prismaService.patient, 'update')
        .mockResolvedValueOnce({ ...testPatient, name: 'another name' });

      const updatedPatient: UpdatePatientDto = { name: 'another name' };

      const patient = await patientsRepository.update(
        testPatient.id,
        updatedPatient,
      );

      expect(prismaService.patient.update).toHaveBeenCalled();
      expect(patient).toEqual({ ...testPatient, ...updatedPatient });
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService.patient, 'update')
        .mockRejectedValueOnce(new Error());

      expect(
        patientsRepository.update(testPatient.id, { name: 'another name' }),
      ).rejects.toThrowError();
    });
  });

  describe('deletePatient method (DELETE)', () => {
    it("should delete patient's posts", async () => {
      await patientsRepository.remove(testPatient.id);
      expect(prismaService.post.deleteMany).toHaveBeenCalled();
    });

    it("should delete patient's therapists", async () => {
      await patientsRepository.remove(testPatient.id);
      expect(prismaService.therapist.deleteMany).toHaveBeenCalled();
    });

    it('should delete patient', async () => {
      const patient = await patientsRepository.remove(testPatient.id);

      expect(patient).toEqual(testPatient);
      expect(prismaService.patient.delete).toHaveBeenCalled();
      expect(prismaService.post.deleteMany).toHaveBeenCalled();
      expect(prismaService.therapist.deleteMany).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockRejectedValueOnce(new Error());

      expect(patientsRepository.remove(testPatient.id)).rejects.toThrowError();
    });
  });
});
