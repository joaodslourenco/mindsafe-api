import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientEntity } from './entities/patient.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatientsRepository } from './repositories/patients.repository';

describe('PatientsController', () => {
  let patientsController: PatientsController;
  let patientsService: PatientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [PatientsService, PatientsRepository, PrismaService],
    }).compile();

    patientsController = module.get<PatientsController>(PatientsController);
    patientsService = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(patientsController).toBeDefined();
  });

  describe('create method (POST)', () => {
    const testPatient: PatientEntity = {
      id: '13216546',
      name: 'test',
      email: 'teste@teste.com',
      password: '123456',
      createdAt: new Date(),
    };

    beforeEach(() => {
      jest
        .spyOn(patientsService, 'create')
        .mockImplementation(async () => testPatient);
    });

    it('user should return as defined', async () => {
      const newUser = await patientsController.create(testPatient);

      expect(newUser).toBeDefined();
    });

    it('should return the new patient obj with the same keys', async () => {
      const newUser = await patientsController.create(testPatient);

      expect(Object.keys(newUser)).toEqual(Object.keys(testPatient));
    });
  });
});
