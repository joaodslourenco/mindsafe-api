import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientEntity } from './entities/patient.entity';

const testPatient: PatientEntity = {
  id: '13216546',
  name: 'test',
  email: 'teste@teste.com',
  password: '123456',
  createdAt: new Date(),
};

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
            findAll: jest.fn(),
            findAllPostsByPatient: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
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
});
