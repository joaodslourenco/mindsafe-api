import { Test, TestingModule } from '@nestjs/testing';
import { TherapistsController } from './therapists.controller';
import { TherapistsService } from './therapists.service';

describe('TherapistsController', () => {
  let controller: TherapistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TherapistsController],
      providers: [TherapistsService],
    }).compile();

    controller = module.get<TherapistsController>(TherapistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
