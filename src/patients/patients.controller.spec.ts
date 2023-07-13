import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
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

describe('PatientsController', () => {
  let patientsController: PatientsController;
  let patientsService: PatientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: {
            create: jest.fn().mockResolvedValue(testPatient),
            findOne: jest.fn().mockResolvedValue(testPatient),
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

    patientsController = module.get<PatientsController>(PatientsController);
    patientsService = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(patientsController).toBeDefined();
  });

  describe('create method (POST)', () => {
    it('should return as defined', async () => {
      const newUser = await patientsController.create(testPatient);

      expect(newUser).toBeDefined();
    });

    it('should have called patientsService Create', async () => {
      patientsController.create(testPatient);
      expect(patientsService.create).toHaveBeenCalled();
    });

    it('should return the new patient obj with the same keys', async () => {
      const newUser = await patientsController.create(testPatient);

      expect(Object.keys(newUser)).toEqual(Object.keys(testPatient));
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(patientsService, 'create').mockRejectedValueOnce(new Error());

      expect(patientsController.create(testPatient)).rejects.toThrowError();
    });
  });

  describe('findOne method (GET)', () => {
    it('should get an patient', async () => {
      const patient = await patientsController.findOne(testPatient.id);

      expect(patient).toBe(testPatient);
      expect(patientsService.findOne).toHaveBeenCalledWith(testPatient.id);
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(patientsService, 'findOne').mockRejectedValueOnce(new Error());

      expect(patientsController.findOne(testPatient.id)).rejects.toThrowError();
    });
  });

  describe('findAll method (GET)', () => {
    it('should get all patients', async () => {
      const patients = await patientsController.findAll();

      expect(patients).toBe(arrayOfPatients);
      expect(patientsService.findAll).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(patientsService, 'findAll').mockRejectedValueOnce(new Error());

      expect(patientsController.findAll()).rejects.toThrowError();
    });
  });

  describe('findAllPostsByPatient method (GET)', () => {
    it('should get all patients', async () => {
      const patientPosts = await patientsController.findAllPostsByPatient(
        testPatient.id,
      );

      expect(patientPosts).toBe(arrayOfPatientPosts);
      expect(patientsService.findAllPostsByPatient).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(patientsService, 'findAllPostsByPatient')
        .mockRejectedValueOnce(new Error());

      expect(
        patientsController.findAllPostsByPatient(testPatient.id),
      ).rejects.toThrowError();
    });
  });

  describe('updatePatient method (PATCH)', () => {
    it('should update patient', async () => {
      const updatedPatient: UpdatePatientDto = { name: 'another name' };
      const patient = await patientsController.update(
        testPatient.id,
        updatedPatient,
      );

      expect(patient).toEqual({ id: testPatient.id, ...updatedPatient });
      expect(patientsService.update).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(patientsService, 'update').mockRejectedValueOnce(new Error());

      expect(
        patientsController.update(testPatient.id, { name: 'another name' }),
      ).rejects.toThrowError();
    });
  });

  describe('deletePatient method (DELETE)', () => {
    it('should delete patient', async () => {
      const patient = await patientsController.remove(testPatient.id);

      expect(patient).toEqual(testPatient);
      expect(patientsService.remove).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest.spyOn(patientsService, 'remove').mockRejectedValueOnce(new Error());

      expect(patientsController.remove(testPatient.id)).rejects.toThrowError();
    });
  });
});
