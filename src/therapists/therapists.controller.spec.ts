import { Test, TestingModule } from '@nestjs/testing';
import { TherapistsController } from './therapists.controller';
import { TherapistsService } from './therapists.service';
import { UpdatePatientDto } from 'src/patients/dto/update-patient.dto';

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

  describe('create method (POST)', () => {
    it('should return as defined', async () => {
      const newUser = await therapistsController.create(testTherapist);

      expect(newUser).toBeDefined();
    });

    it('should have called therapistsService Create', async () => {
      await therapistsController.create(testTherapist);
      expect(therapistsService.create).toHaveBeenCalled();
    });

    it('should return the new therapist obj with the same keys', async () => {
      const newUser = await therapistsController.create(testTherapist);

      expect(Object.keys(newUser)).toEqual(Object.keys(testTherapist));
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsService, 'create')
        .mockRejectedValueOnce(new Error());

      expect(therapistsController.create(testTherapist)).rejects.toThrowError();
    });
  });

  describe('findOne method (GET)', () => {
    it('should get an therapist', async () => {
      const therapist = await therapistsController.findOne(testTherapist.id);

      expect(therapist).toBe(testTherapist);
      expect(therapistsService.findOne).toHaveBeenCalledWith(testTherapist.id);
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsService, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(
        therapistsController.findOne(testTherapist.id),
      ).rejects.toThrowError();
    });
  });

  describe('findAll method (GET)', () => {
    it('should get all therapists', async () => {
      const therapists = await therapistsController.findAll();

      expect(therapists).toBe(arrayOfTherapists);
      expect(therapistsService.findAll).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsService, 'findAll')
        .mockRejectedValueOnce(new Error());

      expect(therapistsController.findAll()).rejects.toThrowError();
    });
  });

  describe('updateTherapist method (PATCH)', () => {
    it('should update therapist', async () => {
      const updatedTherapist: UpdatePatientDto = { name: 'another name' };
      const therapist = await therapistsController.update(
        testTherapist.id,
        updatedTherapist,
      );

      expect(therapist).toEqual({ id: testTherapist.id, ...updatedTherapist });
      expect(therapistsService.update).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsService, 'update')
        .mockRejectedValueOnce(new Error());

      expect(
        therapistsController.update(testTherapist.id, { name: 'another name' }),
      ).rejects.toThrowError();
    });
  });

  describe('deleteTherapist method (DELETE)', () => {
    it('should delete therapist', async () => {
      const therapist = await therapistsController.remove(testTherapist.id);

      expect(therapist).toEqual(testTherapist);
      expect(therapistsService.remove).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsService, 'remove')
        .mockRejectedValueOnce(new Error());

      expect(
        therapistsController.remove(testTherapist.id),
      ).rejects.toThrowError();
    });
  });
});
