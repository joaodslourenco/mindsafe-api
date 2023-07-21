import { Test, TestingModule } from '@nestjs/testing';
import { TherapistsService } from './therapists.service';
import { TherapistsRepository } from './repositories/therapists.repository';
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

describe('TherapistsService', () => {
  let therapistsService: TherapistsService;
  let therapistsRepository: TherapistsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TherapistsService,
        {
          provide: TherapistsRepository,
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

    therapistsService = module.get<TherapistsService>(TherapistsService);
    therapistsRepository =
      module.get<TherapistsRepository>(TherapistsRepository);
  });

  it('should be defined', () => {
    expect(therapistsService).toBeDefined();
  });

  describe('create method (POST)', () => {
    it('should return as defined', async () => {
      const newUser = await therapistsService.create(testTherapist);

      expect(newUser).toBeDefined();
    });

    it('should have called therapistsRepository Create', async () => {
      await therapistsService.create(testTherapist);
      expect(therapistsRepository.create).toHaveBeenCalled();
    });

    it('should return the new therapist obj with the same keys', async () => {
      const newUser = await therapistsService.create(testTherapist);

      expect(Object.keys(newUser)).toEqual(Object.keys(testTherapist));
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsRepository, 'create')
        .mockRejectedValueOnce(new Error());

      expect(therapistsService.create(testTherapist)).rejects.toThrowError();
    });
  });

  describe('findOne method (GET)', () => {
    it('should get an therapist', async () => {
      const therapist = await therapistsService.findOne(testTherapist.id);

      expect(therapist).toBe(testTherapist);
      expect(therapistsRepository.findOne).toHaveBeenCalledWith(
        testTherapist.id,
      );
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(
        therapistsService.findOne(testTherapist.id),
      ).rejects.toThrowError();
    });
  });

  describe('findAll method (GET)', () => {
    it('should get all therapists', async () => {
      const therapists = await therapistsService.findAll();

      expect(therapists).toBe(arrayOfTherapists);
      expect(therapistsRepository.findAll).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsRepository, 'findAll')
        .mockRejectedValueOnce(new Error());

      expect(therapistsService.findAll()).rejects.toThrowError();
    });
  });

  describe('updateTherapist method (PATCH)', () => {
    it('should update therapist', async () => {
      const updatedTherapist: UpdatePatientDto = { name: 'another name' };
      const therapist = await therapistsService.update(
        testTherapist.id,
        updatedTherapist,
      );

      expect(therapist).toEqual({ id: testTherapist.id, ...updatedTherapist });
      expect(therapistsRepository.update).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsRepository, 'update')
        .mockRejectedValueOnce(new Error());

      expect(
        therapistsService.update(testTherapist.id, { name: 'another name' }),
      ).rejects.toThrowError();
    });
  });

  describe('deleteTherapist method (DELETE)', () => {
    it('should delete therapist', async () => {
      const therapist = await therapistsService.remove(testTherapist.id);

      expect(therapist).toEqual(testTherapist);
      expect(therapistsRepository.remove).toHaveBeenCalled();
    });

    it("should throw an exception when there's an error", () => {
      jest
        .spyOn(therapistsRepository, 'remove')
        .mockRejectedValueOnce(new Error());

      expect(therapistsService.remove(testTherapist.id)).rejects.toThrowError();
    });
  });
});
