import { Test, TestingModule } from '@nestjs/testing';
import { TherapistsController } from './therapists.controller';
import { TherapistsService } from './therapists.service';
import { UpdatePatientDto } from 'src/patients/dto/update-patient.dto';

const testTherapist = {};

const arrayOfTherapists = [testTherapist, testTherapist, testTherapist];

describe('TherapistsController', () => {
  let therapistsController: TherapistsController;
  let therapistsService: TherapistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TherapistsController],
      providers: [
        {
          provide: TherapistsService,
          useValue: {
            create: jest.fn().mockResolvedValue(testTherapist),
            findOne: jest.fn().mockResolvedValue(testTherapist),
            findAll: jest.fn().mockResolvedValue(arrayOfTherapists),
            update: jest
              .fn()
              .mockImplementation(
                (id: string, updateDto: UpdatePatientDto) => ({
                  id,
                  ...updateDto,
                }),
              ),
            remove: jest.fn().mockResolvedValue(testTherapist),
          },
        },
      ],
    }).compile();

    therapistsController =
      module.get<TherapistsController>(TherapistsController);
    therapistsService = module.get<TherapistsService>(TherapistsService);
  });

  it('should be defined', () => {
    expect(therapistsController).toBeDefined();
  });
});
