import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { PatientsRepository } from './repositories/patients.repository';
import { PatientEntity } from './entities/patient.entity';
import { UpdatePatientDto } from './dto/update-patient.dto';

const testPatient: PatientEntity = {
  id: '13216546',
  name: 'test',
  email: 'teste@teste.com',
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

describe('PatientsService', () => {
  let patientsService: PatientsService;
  let patientsRepository: PatientsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: PatientsRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(testPatient),
            findOne: jest.fn().mockResolvedValue(testPatient),
            findOneByEmail: jest.fn().mockResolvedValue(testPatient),
            findAll: jest.fn().mockResolvedValue(arrayOfPatients),
            findAllPostsByPatient: jest
              .fn()
              .mockResolvedValue(arrayOfPatientPosts),
            update: jest
              .fn()
              .mockImplementation(
                (id: string, updateDto: UpdatePatientDto) => ({
                  id,
                  ...updateDto,
                }),
              ),
            remove: jest.fn().mockResolvedValue(testPatient),
          },
        },
      ],
    }).compile();

    patientsService = module.get<PatientsService>(PatientsService);
    patientsRepository = module.get<PatientsRepository>(PatientsRepository);
  });

  it('should be defined', () => {
    expect(patientsService).toBeDefined();
  });

  describe('create method (POST)', () => {
    it('should return as defined', async () => {
      const newUser = await patientsService.create(testPatient);

      expect(newUser).toBeDefined();
    });

    it('should have called patientsRepository Create', async () => {
      await patientsService.create(testPatient);
      expect(patientsRepository.create).toHaveBeenCalled();
    });

    it('should return the new patient obj with the same keys', async () => {
      const newUser = await patientsService.create(testPatient);

      expect(Object.keys(newUser)).toEqual(Object.keys(testPatient));
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(patientsService, 'create').mockRejectedValueOnce(new Error());

      expect(patientsService.create(testPatient)).rejects.toThrowError();
    });
  });

  describe('findOne method (GET)', () => {
    it('should get an patient', async () => {
      const patient = await patientsService.findOne(testPatient.id);

      expect(patient).toBe(testPatient);
      expect(patientsRepository.findOne).toHaveBeenCalledWith(testPatient.id);
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(patientsService, 'findOne').mockRejectedValueOnce(new Error());

      expect(patientsService.findOne(testPatient.id)).rejects.toThrowError();
    });
  });

  describe('findAll method (GET)', () => {
    it('should get all patients', async () => {
      const patients = await patientsService.findAll();

      expect(patients).toBe(arrayOfPatients);
      expect(patientsRepository.findAll).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(patientsRepository, 'findAll')
        .mockRejectedValueOnce(new Error());

      expect(patientsService.findAll()).rejects.toThrowError();
    });
  });

  describe('findAllPostsByPatient method (GET)', () => {
    it('should get all patients', async () => {
      const patientPosts = await patientsService.findAllPostsByPatient(
        testPatient.id,
      );

      expect(patientPosts).toBe(arrayOfPatientPosts);
      expect(patientsRepository.findAllPostsByPatient).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(patientsService, 'findAllPostsByPatient')
        .mockRejectedValueOnce(new Error());

      expect(
        patientsService.findAllPostsByPatient(testPatient.id),
      ).rejects.toThrowError();
    });
  });

  describe('updatePatient method (PATCH)', () => {
    it('should update patient', async () => {
      const updatedPatient: UpdatePatientDto = { name: 'another name' };
      const patient = await patientsService.update(
        testPatient.id,
        updatedPatient,
      );

      expect(patient).toEqual({ id: testPatient.id, ...updatedPatient });
      expect(patientsRepository.update).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(patientsService, 'update').mockRejectedValueOnce(new Error());

      expect(
        patientsService.update(testPatient.id, { name: 'another name' }),
      ).rejects.toThrowError();
    });
  });

  describe('deletePatient method (DELETE)', () => {
    it('should delete patient', async () => {
      const patient = await patientsService.remove(testPatient.id);

      expect(patient).toEqual(testPatient);
      expect(patientsRepository.remove).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(patientsService, 'remove').mockRejectedValueOnce(new Error());

      expect(patientsService.remove(testPatient.id)).rejects.toThrowError();
    });
  });
});
